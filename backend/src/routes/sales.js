/**
 * Kaabu Technologies - Sales, Orders & Financial Hub Routes
 * /api/sales
 * Tracks daily revenue, payment methods breakdown (Wave, Cash, Card), expenses, and net profit
 */

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const waveService = require('../services/waveService');
const smsService = require('../services/smsService');

// Helper to broadcast via WebSocket (injected in server.js)
let wsBroadcaster = () => {};
router.setBroadcaster = (fn) => { wsBroadcaster = fn; };

// GET /api/sales/overview - High level financial metrics for God's Eye Dashboard
router.get('/overview', (req, res) => {
  try {
    const orders = db.findAll('orders');
    const expenses = db.findAll('store_expenses');

    // Revenue calculations
    const paidOrders = orders.filter(o => o.payment_status === 'paid');
    const totalRevenueGmd = paidOrders.reduce((sum, o) => sum + Number(o.total_gmd || 0), 0);
    const totalExpensesGmd = expenses.reduce((sum, e) => sum + Number(e.amount_gmd || 0), 0);
    const netProfitGmd = totalRevenueGmd - totalExpensesGmd;

    // Payment methods breakdown
    const paymentMethods = {
      wave_money: paidOrders.filter(o => o.payment_method === 'wave_money').reduce((sum, o) => sum + Number(o.total_gmd || 0), 0),
      cash: paidOrders.filter(o => o.payment_method === 'cash').reduce((sum, o) => sum + Number(o.total_gmd || 0), 0),
      card: paidOrders.filter(o => o.payment_method === 'card').reduce((sum, o) => sum + Number(o.total_gmd || 0), 0),
      local_transfer: paidOrders.filter(o => o.payment_method === 'local_transfer').reduce((sum, o) => sum + Number(o.total_gmd || 0), 0)
    };

    // Orders breakdown by status
    const activeOrdersCount = orders.filter(o => ['received', 'preparing', 'plating'].includes(o.status)).length;
    const completedOrdersCount = orders.filter(o => o.status === 'completed').length;

    // Daily breakdown for trend charts (last 7 days)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayRevenue = paidOrders
        .filter(o => o.created_at && o.created_at.startsWith(dateStr))
        .reduce((sum, o) => sum + Number(o.total_gmd || 0), 0);

      const dayExpenses = expenses
        .filter(e => e.expense_date === dateStr || (e.created_at && e.created_at.startsWith(dateStr)))
        .reduce((sum, e) => sum + Number(e.amount_gmd || 0), 0);

      dailyTrend.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenueGmd: Number(dayRevenue.toFixed(2)),
        expensesGmd: Number(dayExpenses.toFixed(2)),
        profitGmd: Number((dayRevenue - dayExpenses).toFixed(2))
      });
    }

    res.json({
      totalRevenueGmd: Number(totalRevenueGmd.toFixed(2)),
      totalExpensesGmd: Number(totalExpensesGmd.toFixed(2)),
      netProfitGmd: Number(netProfitGmd.toFixed(2)),
      activeOrdersCount,
      completedOrdersCount,
      totalOrdersCount: orders.length,
      paymentMethods,
      dailyTrend
    });
  } catch (err) {
    console.error('[SALES OVERVIEW ERROR]', err);
    res.status(500).json({ error: 'Failed to aggregate financial overview' });
  }
});

// GET /api/sales/orders - List orders
router.get('/orders', (req, res) => {
  const orders = db.findAll('orders');
  // Enrich with items
  const enriched = orders.map(order => {
    const items = db.findAll('order_items', i => i.order_id === order.id);
    return { ...order, items };
  });
  // Sort by recent
  enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(enriched);
});

// POST /api/sales/orders - Create a new order
router.post('/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      orderType = 'dine_in',
      tableNumber,
      items = [],
      paymentMethod = 'wave_money',
      notes
    } = req.body;

    if (!customerName || !customerPhone || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone, and at least one item required' });
    }

    let subtotal = 0;
    const orderItemsToSave = [];

    for (const item of items) {
      const itemSubtotal = Number(item.unitPriceGmd) * Number(item.quantity);
      subtotal += itemSubtotal;
      orderItemsToSave.push({
        menu_item_id: item.menuItemId || item.id,
        item_name: item.name,
        unit_price_gmd: Number(item.unitPriceGmd),
        quantity: Number(item.quantity),
        customizations_json: JSON.stringify(item.customizations || []),
        subtotal_gmd: itemSubtotal
      });
    }

    const orderNumber = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalGmd = subtotal;

    const newOrder = db.insert('orders', {
      order_number: orderNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      order_type: orderType,
      table_number: tableNumber || (orderType === 'dine_in' ? 'T-4' : 'N/A'),
      status: 'received',
      subtotal_gmd: subtotal,
      discount_gmd: 0.00,
      tax_gmd: 0.00,
      total_gmd: totalGmd,
      payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
      payment_method: paymentMethod,
      notes: notes || ''
    });

    for (const orderItem of orderItemsToSave) {
      db.insert('order_items', {
        order_id: newOrder.id,
        ...orderItem
      });
    }

    // Generate Wave checkout session if Wave selected
    let waveSession = null;
    if (paymentMethod === 'wave_money') {
      waveSession = await waveService.createCheckoutSession({
        orderId: newOrder.id,
        orderNumber,
        amountGMD: totalGmd,
        customerPhone,
        customerName
      });
    }

    // Broadcast new order event to God's Eye live dashboard
    wsBroadcaster({
      type: 'ORDER_PLACED',
      order: { ...newOrder, items: orderItemsToSave },
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      order: newOrder,
      items: orderItemsToSave,
      waveSession
    });
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /api/sales/orders/:id/status - Update order preparation stage
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.payment_status = paymentStatus;

    const updated = db.update('orders', id, updates);
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    wsBroadcaster({
      type: 'ORDER_STATUS_UPDATED',
      orderId: id,
      newStatus: status,
      paymentStatus,
      timestamp: new Date().toISOString()
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET /api/sales/expenses - List store expenses
router.get('/expenses', (req, res) => {
  const expenses = db.findAll('store_expenses');
  expenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(expenses);
});

// POST /api/sales/expenses - Log a store expense
router.post('/expenses', (req, res) => {
  try {
    const { title, category, amountGmd, paymentMethod = 'cash', vendorName, receiptReference, expenseDate } = req.body;
    if (!title || !amountGmd) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }

    const newExpense = db.insert('store_expenses', {
      title,
      category: category || 'raw_ingredients',
      amount_gmd: Number(amountGmd),
      payment_method: paymentMethod,
      vendor_name: vendorName || 'Pipeline Local Supplier',
      receipt_reference: receiptReference || `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      logged_by_user_id: 'admin-system',
      expense_date: expenseDate || new Date().toISOString().split('T')[0]
    });

    wsBroadcaster({
      type: 'EXPENSE_LOGGED',
      expense: newExpense,
      timestamp: new Date().toISOString()
    });

    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log expense' });
  }
});

// POST /api/sales/reservations - Table reservation trigger
router.post('/reservations', (req, res) => {
  try {
    const { guestName, guestPhone, guestCount, reservationDate, reservationTime, tablePreference, specialRequests } = req.body;
    if (!guestName || !guestPhone || !reservationDate || !reservationTime) {
      return res.status(400).json({ error: 'Missing required reservation fields' });
    }

    const reservation = db.insert('table_reservations', {
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_count: Number(guestCount) || 2,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      table_preference: tablePreference || 'vip_lounge',
      status: 'confirmed',
      special_requests: specialRequests || ''
    });

    wsBroadcaster({
      type: 'RESERVATION_CREATED',
      reservation,
      timestamp: new Date().toISOString()
    });

    // Automated SMS Confirmation to Guest
    smsService.notifyReservationConfirmed({
      guestName,
      guestPhone,
      reservationDate,
      reservationTime,
      tablePreference: tablePreference || 'vip_lounge'
    }).catch(err => console.error('[SMS RESERVATION ERROR]', err));

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to book reservation' });
  }
});

// GET /api/sales/reservations - List reservations
router.get('/reservations', (req, res) => {
  const reservations = db.findAll('table_reservations');
  res.json(reservations);
});

module.exports = router;
