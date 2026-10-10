/**
 * Kaabu Technologies - Choco Loco Enterprise Operating Server
 * Express REST APIs + Real-time WebSockets for "God's Eye" Operations Visualizer
 */

const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
const env = require('../../config/env');

const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const shiftsRoutes = require('./routes/shifts');
const timeclockRoutes = require('./routes/timeclock');
const payrollRoutes = require('./routes/payroll');
const salesRoutes = require('./routes/sales');
const menuRoutes = require('./routes/menu');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });
const connectedClients = new Set();

wss.on('connection', (ws, req) => {
  connectedClients.add(ws);
  console.log(`[WEBSOCKET] Client connected for God's Eye live stream. Total: ${connectedClients.size}`);

  // Send initial handshake and active store beacon
  ws.send(JSON.stringify({
    type: 'CONNECTION_ESTABLISHED',
    client: 'Kaabu-GodsEye-Client',
    timestamp: new Date().toISOString(),
    store: env.brand.name
  }));

  ws.on('close', () => {
    connectedClients.delete(ws);
    console.log(`[WEBSOCKET] Client disconnected. Total: ${connectedClients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WEBSOCKET ERROR]', err);
    connectedClients.delete(ws);
  });
});

// Broadcast helper function to notify all dashboards
function broadcastLiveEvent(data) {
  const message = JSON.stringify(data);
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
        console.error('[WS BROADCAST ERROR]', err);
      }
    }
  }
}

// Inject broadcast function into routes that generate real-time events
salesRoutes.setBroadcaster(broadcastLiveEvent);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (logos, dessert images)
app.use('/static', express.static(path.resolve(__dirname, '../../assets/public')));
app.use('/assets', express.static(path.resolve(__dirname, '../../frontend/public/static')));
app.use('/src', express.static(path.resolve(__dirname, '../../frontend/src')));
app.use(express.static(path.resolve(__dirname, '../../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/index.html'));
});

// Request logging
app.use((req, res, next) => {
  if (!req.url.startsWith('/static') && !req.url.startsWith('/assets')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/timeclock', timeclockRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/menu', menuRoutes);

// System Health & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Choco Loco Enterprise Operating System',
    agency: 'Kaabu Technologies',
    version: '1.0.0-PROD',
    timestamp: new Date().toISOString(),
    activeSockets: connectedClients.size,
    storeLocation: env.brand.location,
    currency: env.brand.currency
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('[SERVER UNHANDLED EXCEPTION]', err);
  res.status(500).json({ error: 'Internal server error occurred', details: err.message });
});

// Start Server
const PORT = env.port;
server.listen(PORT, env.host, () => {
  console.log('================================================================');
  console.log(`🍫 CHOCO LOCO ENTERPRISE OPERATING SYSTEM (KAABU TECHNOLOGIES)`);
  console.log(`📍 Location: ${env.brand.location}`);
  console.log(`🚀 REST API Server running on: http://localhost:${PORT}`);
  console.log(`📡 WebSocket God's Eye stream active on: ws://localhost:${PORT}`);
  console.log('================================================================');
});

module.exports = { app, server, broadcastLiveEvent };
