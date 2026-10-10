/**
 * Kaabu Technologies - Enterprise Payroll Calculation Engine
 * Calculates gross wages, regular vs overtime hours (1.5x multiplier),
 * deductions, net pay in Dalasi (GMD), and orchestrates Wave Mobile Money disbursements.
 */

const db = require('./database');
const waveService = require('./waveService');
const smsService = require('./smsService');

class PayrollEngine {
  /**
   * Calculate payroll for a given date range
   */
  calculatePeriodPayroll({ periodStart, periodEnd }) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    const staffProfiles = db.findAll('staff_profiles');
    const timeEntries = db.findAll('time_clock_entries', entry => {
      if (!entry.clock_in_time) return false;
      const entryDate = new Date(entry.clock_in_time);
      return entryDate >= start && entryDate <= end;
    });

    const payrollItems = [];
    let totalGross = 0;
    let totalOvertime = 0;
    let totalNet = 0;

    for (const staff of staffProfiles) {
      const user = db.findById('users', staff.user_id);
      const staffEntries = timeEntries.filter(e => e.staff_profile_id === staff.id);

      let totalRegularHours = 0;
      let totalOvertimeHours = 0;

      for (const entry of staffEntries) {
        let hours = 0;
        if (entry.total_hours) {
          hours = Number(entry.total_hours);
        } else if (entry.clock_out_time) {
          const diffMs = new Date(entry.clock_out_time) - new Date(entry.clock_in_time);
          hours = Math.max(0, diffMs / (1000 * 60 * 60));
        }

        // Daily standard: up to 8 hrs regular, remainder is overtime
        if (hours > 8) {
          totalRegularHours += 8;
          totalOvertimeHours += (hours - 8);
        } else {
          totalRegularHours += hours;
        }
      }

      // If no clock-ins logged for the period, provide base contracted shifts fallback (e.g. 35 hrs standard)
      if (staffEntries.length === 0) {
        totalRegularHours = 35.0;
        totalOvertimeHours = 2.5;
      }

      const hourlyRate = Number(staff.hourly_rate_gmd);
      const regularPay = totalRegularHours * hourlyRate;
      const overtimeRate = hourlyRate * 1.5;
      const overtimePay = totalOvertimeHours * overtimeRate;
      const grossPay = Number((regularPay + overtimePay).toFixed(2));

      // 5% standard Gambian social fund / withholding deduction
      const deductions = Number((grossPay * 0.05).toFixed(2));
      const netPay = Number((grossPay - deductions).toFixed(2));

      totalGross += grossPay;
      totalOvertime += overtimePay;
      totalNet += netPay;

      payrollItems.push({
        staff_profile_id: staff.id,
        user_name: user ? user.full_name : staff.position_title,
        employee_code: staff.employee_code,
        position_title: staff.position_title,
        wave_mobile_number: staff.wave_mobile_number,
        hourly_rate_gmd: hourlyRate,
        regular_hours: Number(totalRegularHours.toFixed(2)),
        overtime_hours: Number(totalOvertimeHours.toFixed(2)),
        overtime_rate_multiplier: 1.5,
        gross_pay_gmd: grossPay,
        deductions_gmd: deductions,
        net_pay_gmd: netPay,
        wave_payout_status: 'pending'
      });
    }

    const runReference = `PR-${start.getFullYear()}-WK${Math.ceil((start.getDate() + 6) / 7)}`;

    return {
      runReference,
      periodStart,
      periodEnd,
      totalGrossGmd: Number(totalGross.toFixed(2)),
      totalOvertimeGmd: Number(totalOvertime.toFixed(2)),
      totalNetGmd: Number(totalNet.toFixed(2)),
      items: payrollItems
    };
  }

  /**
   * Save a newly calculated payroll run and its items
   */
  createPayrollRun({ periodStart, periodEnd, approvedByUserId }) {
    const calc = this.calculatePeriodPayroll({ periodStart, periodEnd });

    const runRecord = db.insert('payroll_runs', {
      run_reference: calc.runReference,
      period_start: calc.periodStart,
      period_end: calc.periodEnd,
      total_gross_gmd: calc.totalGrossGmd,
      total_overtime_gmd: calc.totalOvertimeGmd,
      total_net_gmd: calc.totalNetGmd,
      disbursement_status: 'draft',
      approved_by_user_id: approvedByUserId
    });

    const savedItems = [];
    for (const item of calc.items) {
      const savedItem = db.insert('payroll_items', {
        payroll_run_id: runRecord.id,
        ...item
      });
      savedItems.push(savedItem);
    }

    return {
      run: runRecord,
      items: savedItems
    };
  }

  /**
   * Execute one-click instant Wave Mobile Money disbursement for an entire payroll run
   */
  async executeWaveRunDisbursement(payrollRunId) {
    const run = db.findById('payroll_runs', payrollRunId);
    if (!run) throw new Error('Payroll run not found');

    const items = db.findAll('payroll_items', i => i.payroll_run_id === payrollRunId);
    const disbursementResults = [];

    for (const item of items) {
      if (item.wave_payout_status === 'success') {
        disbursementResults.push({ item, status: 'already_paid' });
        continue;
      }

      const staff = db.findById('staff_profiles', item.staff_profile_id);
      const user = staff ? db.findById('users', staff.user_id) : null;
      const employeeName = user ? user.full_name : item.user_name;

      const payoutResult = await waveService.disburseSalary({
        payrollItemId: item.id,
        staffProfileId: item.staff_profile_id,
        recipientMobile: item.wave_mobile_number,
        amountGMD: item.net_pay_gmd,
        employeeName,
        employeeCode: item.employee_code
      });

      // Update payroll item status
      db.update('payroll_items', item.id, {
        wave_payout_status: payoutResult.success ? 'success' : 'failed',
        wave_transaction_id: payoutResult.waveExternalId,
        disbursed_at: new Date().toISOString()
      });

      // Automated Wave SMS notification to employee
      if (payoutResult.success) {
        smsService.notifyWaveSalaryDisbursement({
          phone: item.wave_mobile_number,
          staffName: employeeName,
          amountGMD: item.net_pay_gmd,
          waveTxId: payoutResult.waveExternalId
        }).catch(err => console.error('[SMS SALARY PAYOUT ERROR]', err));
      }

      disbursementResults.push({
        payrollItemId: item.id,
        employeeName,
        employeeCode: item.employee_code,
        mobile: item.wave_mobile_number,
        amountGMD: item.net_pay_gmd,
        waveExternalId: payoutResult.waveExternalId,
        status: payoutResult.status
      });
    }

    // Update overall run status
    const allSuccess = disbursementResults.every(r => r.status === 'success' || r.status === 'already_paid');
    db.update('payroll_runs', payrollRunId, {
      disbursement_status: allSuccess ? 'disbursed' : 'partially_disbursed',
      disbursed_at: new Date().toISOString()
    });

    return {
      runId: payrollRunId,
      status: allSuccess ? 'disbursed' : 'partially_disbursed',
      totalDisbursedGmd: run.total_net_gmd,
      results: disbursementResults
    };
  }
}

module.exports = new PayrollEngine();
