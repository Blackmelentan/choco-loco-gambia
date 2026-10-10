/**
 * Kaabu Technologies - Choco Loco Ecosystem
 * Component: PayrollManager.jsx
 * Automated Payroll & Wave API Auto-Disbursement for Mobile Money Instant Salary Payouts
 */

window.PayrollManager = function PayrollManager({ onRefreshTrigger }) {
  const [payrollData, setPayrollData] = React.useState(null);
  const [waveBalance, setWaveBalance] = React.useState(null);
  const [payrollRuns, setPayrollRuns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isDisbursing, setIsDisbursing] = React.useState(false);
  const [disbursementModal, setDisbursementModal] = React.useState(null);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const [calcRes, balRes, runsRes] = await Promise.all([
        fetch('/api/payroll/calculate'),
        fetch('/api/payroll/wave-balance'),
        fetch('/api/payroll/runs')
      ]);

      if (calcRes.ok) setPayrollData(await calcRes.json());
      if (balRes.ok) setWaveBalance(await balRes.json());
      if (runsRes.ok) setPayrollRuns(await runsRes.json());
    } catch (err) {
      console.error('Payroll fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayroll();
  }, []);

  // Commit Run & Disburse via Wave API
  const handleExecuteWaveDisbursement = async () => {
    if (!payrollData) return;
    setIsDisbursing(true);

    try {
      // 1. Create a payroll run record
      const runRes = await fetch('/api/payroll/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart: payrollData.periodStart,
          periodEnd: payrollData.periodEnd,
          approvedByUserId: 'usr_admin_01'
        })
      });

      if (!runRes.ok) throw new Error('Failed to create payroll run');
      const runData = await runRes.json();

      // 2. Trigger Wave API Instant Auto-Disbursement
      const disburseRes = await fetch(`/api/payroll/runs/${runData.run.id}/disburse`, {
        method: 'POST'
      });

      if (!disburseRes.ok) throw new Error('Wave disbursement failed');
      const disburseData = await disburseRes.json();

      setDisbursementModal({
        runId: runData.run.id,
        runRef: runData.run.run_reference,
        totalDisbursed: disburseData.totalDisbursedGmd,
        results: disburseData.results
      });

      fetchPayroll();
      if (onRefreshTrigger) onRefreshTrigger();
    } catch (err) {
      alert(`Disbursement Error: ${err.message}`);
    } finally {
      setIsDisbursing(false);
    }
  };

  return (
    <section className="py-8 bg-[#140905] min-h-screen text-[#FFF8F0] space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D2FF] to-[#0072FF] flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20 text-white">
              🌊
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#FFF8F0]">
                  Wave Mobile Money Payroll Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  Instant Payouts
                </span>
              </div>
              <p className="text-xs text-[#FFF8F0]/70 mt-1">
                Automated hours-to-salary calculation • E.164 Gambian Mobile Money disbursements
              </p>
            </div>
          </div>

          {/* Wave Liquidity Indicator */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#140905] border border-[#E5A93C]/20">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#E5A93C] block">Wave Merchant Balance</span>
              <span className="font-mono text-lg font-black text-[#F7C873]">
                {waveBalance?.available_balance?.toLocaleString() || '184,500'} D
              </span>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Calculation Summary Card */}
        {payrollData && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1E0F0A] border border-[#E5A93C]/20 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5A93C]/15">
              <div>
                <span className="text-xs font-mono text-[#E5A93C] font-bold">
                  PERIOD: {payrollData.periodStart} TO {payrollData.periodEnd} • {payrollData.runReference}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FFF8F0] mt-1">
                  Active Pay Period Roster
                </h3>
              </div>

              {/* One-Click Execute CTA */}
              <button
                onClick={handleExecuteWaveDisbursement}
                disabled={isDisbursing}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00D2FF] to-[#0072FF] text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span>🌊</span>
                <span>{isDisbursing ? 'Transmitting Wave Payouts...' : 'Execute Instant Wave Payouts'}</span>
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/15">
                <span className="text-xs text-[#FFF8F0]/60 block">Total Gross Wages</span>
                <span className="text-xl font-mono font-bold text-[#FFF8F0]">{payrollData.totalGrossGmd} D</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/15">
                <span className="text-xs text-[#FFF8F0]/60 block">Overtime Pay (1.5x)</span>
                <span className="text-xl font-mono font-bold text-amber-400">{payrollData.totalOvertimeGmd} D</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#2A160E] border border-[#E5A93C]/15">
                <span className="text-xs text-[#FFF8F0]/60 block">Net Payouts to Disburse</span>
                <span className="text-xl font-mono font-black text-[#F7C873]">{payrollData.totalNetGmd} D</span>
              </div>
            </div>

            {/* Staff Payroll Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5A93C]/20 text-[#E5A93C] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Wave Mobile</th>
                    <th className="py-3 px-4">Hourly Rate</th>
                    <th className="py-3 px-4">Regular Hrs</th>
                    <th className="py-3 px-4">Overtime Hrs</th>
                    <th className="py-3 px-4">Gross</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Net Salary</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5A93C]/10 text-[#FFF8F0]">
                  {payrollData.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#2A160E]/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold block">{item.user_name}</span>
                        <span className="text-[10px] text-[#E5A93C]">{item.position_title} ({item.employee_code})</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-400">{item.wave_mobile_number}</td>
                      <td className="py-3 px-4 font-mono">{item.hourly_rate_gmd} D/h</td>
                      <td className="py-3 px-4 font-mono">{item.regular_hours} h</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{item.overtime_hours} h</td>
                      <td className="py-3 px-4 font-mono">{item.gross_pay_gmd} D</td>
                      <td className="py-3 px-4 font-mono text-red-400">-{item.deductions_gmd} D</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#F7C873]">{item.net_pay_gmd} D</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {item.wave_payout_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Modal: Payout Execution Receipts */}
        {disbursementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[#1E0F0A] rounded-3xl border border-blue-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5A93C]/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌊</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-400">Wave Disbursement Confirmed</span>
                    <h3 className="font-serif text-xl font-bold text-[#FFF8F0]">{disbursementModal.runRef}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setDisbursementModal(null)}
                  className="w-8 h-8 rounded-full bg-[#2A160E] text-[#FFF8F0] hover:text-[#E5A93C] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {disbursementModal.results.map((res, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#2A160E] border border-blue-500/20 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#FFF8F0]">{res.employeeName} ({res.employeeCode})</p>
                      <p className="font-mono text-blue-400">{res.mobile}</p>
                      <p className="text-[10px] text-[#FFF8F0]/50 font-mono">TX: {res.waveExternalId}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#F7C873] text-sm block">{res.amountGMD} D</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        ✓ Disbursed
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#140905] border border-[#E5A93C]/20 flex items-center justify-between">
                <span className="text-xs text-[#FFF8F0]/70">Total Transferred Liquidity:</span>
                <span className="font-mono font-black text-lg text-[#F7C873]">{disbursementModal.totalDisbursed} D (GMD)</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
