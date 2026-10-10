/**
 * Kaabu Technologies - Automated Payroll & Wave API Disbursement Routes
 * /api/payroll
 */

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const payrollEngine = require('../services/payrollEngine');
const waveService = require('../services/waveService');

// GET /api/payroll/calculate - Calculate preview payroll for dates
router.get('/calculate', (req, res) => {
  try {
    const { start, end } = req.query;
    const periodStart = start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const periodEnd = end || new Date().toISOString().split('T')[0];

    const calculation = payrollEngine.calculatePeriodPayroll({ periodStart, periodEnd });
    res.json(calculation);
  } catch (err) {
    console.error('[PAYROLL CALC ERROR]', err);
    res.status(500).json({ error: 'Failed to calculate payroll' });
  }
});

// POST /api/payroll/runs - Commit and save a new payroll run
router.post('/runs', (req, res) => {
  try {
    const { periodStart, periodEnd, approvedByUserId } = req.body;
    const result = payrollEngine.createPayrollRun({
      periodStart: periodStart || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodEnd: periodEnd || new Date().toISOString().split('T')[0],
      approvedByUserId: approvedByUserId || 'admin-system'
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payroll run' });
  }
});

// GET /api/payroll/runs - List all payroll runs
router.get('/runs', (req, res) => {
  const runs = db.findAll('payroll_runs');
  res.json(runs);
});

// GET /api/payroll/runs/:id - Get specific payroll run with items
router.get('/runs/:id', (req, res) => {
  const run = db.findById('payroll_runs', req.params.id);
  if (!run) return res.status(404).json({ error: 'Payroll run not found' });

  const items = db.findAll('payroll_items', i => i.payroll_run_id === run.id);
  res.json({ run, items });
});

// POST /api/payroll/runs/:id/disburse - Trigger Wave API Instant Auto-Disbursement
router.post('/runs/:id/disburse', async (req, res) => {
  try {
    const result = await payrollEngine.executeWaveRunDisbursement(req.params.id);
    res.json({
      message: 'Wave Mobile Money salary disbursement executed',
      ...result
    });
  } catch (err) {
    console.error('[WAVE DISBURSEMENT ERROR]', err);
    res.status(500).json({ error: err.message || 'Failed to disburse payroll' });
  }
});

// GET /api/payroll/wave-balance - Check live liquidity for salary payouts
router.get('/wave-balance', async (req, res) => {
  try {
    const balance = await waveService.getMerchantBalance();
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Wave account balance' });
  }
});

// GET /api/payroll/transactions - List all Wave Mobile Money transaction logs
router.get('/transactions', (req, res) => {
  const transactions = db.findAll('wave_payout_transactions');
  res.json(transactions);
});

module.exports = router;
