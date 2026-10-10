/**
 * Kaabu Technologies - Choco Loco Digital Transformation Ecosystem
 * Environment & Application Configuration
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || '0.0.0.0',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Brand Configuration
  brand: {
    name: 'Choco Loco Patisserie & Lounge',
    tagline: 'Artisanal Belgian Chocolate & Luxury Patisserie',
    location: 'Pipeline (Opposite Pipeline Mosque), Kairaba Corridor, The Gambia',
    phone: '+220 400 0060',
    currency: 'GMD',
    currencySymbol: 'D',
    timezone: 'Africa/Banjul'
  },

  // Security & Authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'choco-loco-kaabu-super-secret-jwt-key-2026-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'Kaabu Technologies Authentication Engine',
    audience: 'Choco Loco Enterprise Operating System'
  },

  // Database Configuration
  database: {
    dialect: process.env.DB_DIALECT || 'sqlite', // Seamless portability: SQLite zero-config or PostgreSQL
    storage: process.env.DB_STORAGE || path.resolve(__dirname, '../database/choco_loco.sqlite'),
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'choco_loco_db',
    username: process.env.DB_USER || 'choco_admin',
    password: process.env.DB_PASSWORD || 'choco_secure_pass',
    ssl: process.env.DB_SSL === 'true'
  },

  // Wave Mobile Money Integration
  wave: {
    apiUrl: process.env.WAVE_API_URL || 'https://api.wave.com/v1',
    apiKey: process.env.WAVE_API_KEY || 'wv_live_kaabu_chocoloco_disbursement_prod_key',
    webhookSecret: process.env.WAVE_WEBHOOK_SECRET || 'whsec_kaabu_chocoloco_live_webhook_hash',
    merchantId: process.env.WAVE_MERCHANT_ID || 'mer_chocoloco_gambia_pipeline',
    currency: 'GMD',
    countryCode: 'GM', // The Gambia
    disbursementTimeoutMs: 15000
  },

  // Store Geofencing for Audited Time Clock
  geofence: {
    storeLatitude: 13.4475,
    storeLongitude: -16.6782,
    allowedRadiusMeters: 250 // 250m accuracy around Pipeline location
  }
};
