/**
 * Kaabu Technologies - Wave API Mobile Money & Disbursement Configuration
 * Handles Instant Mobile Money Salary Payouts & Customer Checkouts (Senegal & The Gambia)
 */

const env = require('./env');

module.exports = {
  endpoints: {
    base: env.wave.apiUrl,
    checkoutSessions: `${env.wave.apiUrl}/checkout/sessions`,
    payouts: `${env.wave.apiUrl}/disbursements/payouts`,
    balances: `${env.wave.apiUrl}/accounts/balances`,
    transactionLookup: (id) => `${env.wave.apiUrl}/disbursements/payouts/${id}`,
    webhooks: `${env.wave.apiUrl}/webhooks`
  },
  headers: {
    'Authorization': `Bearer ${env.wave.apiKey}`,
    'Content-Type': 'application/json',
    'X-Kaabu-Client': 'ChocoLoco-OperatingSystem-v1.0'
  },
  payoutRules: {
    currency: env.wave.currency,
    maxSingleDisbursement: 50000, // In Dalasi (GMD)
    requireManagerApprovalOver: 20000,
    retryAttempts: 3,
    backoffFactorMs: 1000
  },
  statusCodes: {
    SUCCESS: 'success',
    PENDING: 'processing',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  }
};
