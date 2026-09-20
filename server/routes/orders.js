const express = require('express');
const { queryAll, queryOne, runStmt } = require('../db');

const router = express.Router();

function safeJSON(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customer: row.customer_name,
    phone: row.phone,
    city: row.city,
    address: row.address,
    items: safeJSON(row.items, []),
    amount: row.amount,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    orderDate: row.order_date,
    estimatedDelivery: row.estimated_delivery,
    courier: row.courier,
    deliveryPersonId: row.delivery_person_id,
    timeline: safeJSON(row.timeline, [])
  };
}

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = rows.map(parseOrder);
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Orders list error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  try {
    const row = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order: parseOrder(row) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const o = req.body;
    const id = o.id || `ATD${Date.now()}`;
    const timeline = [{ status: 'ORDER_PLACED', updatedBy: 'System', updatedAt: new Date().toLocaleString('en-IN') }];

    runStmt(
      `INSERT INTO orders (id, customer_id, customer_name, phone, city, address, items, amount, payment_method, payment_status, status, order_date, estimated_delivery, courier, delivery_person_id, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, o.customerId, o.customerName, o.phone, o.city, o.address, JSON.stringify(o.items || []),
       o.amount || 0, o.paymentMethod || 'COD', o.paymentStatus || 'Pending', o.status || 'Processing',
       o.orderDate || new Date().toLocaleString('en-IN'), o.estimatedDelivery || null,
       o.courier || null, o.deliveryPersonId || null, JSON.stringify(timeline)]
    );

    const created = queryOne('SELECT * FROM orders WHERE id = ?', [id]);
    const order = parseOrder(created);

    const io = req.app.get('io');
    if (io) io.emit('orderCreated', { order });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, updatedByRole } = req.body;
    const existing = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });

    const timeline = safeJSON(existing.timeline, []);
    timeline.push({
      status,
      updatedBy: updatedByRole || 'Staff',
      updatedAt: new Date().toLocaleString('en-IN')
    });

    runStmt(
      `UPDATE orders SET status = ?, timeline = ?, updated_at = datetime('now') WHERE id = ?`,
      [status, JSON.stringify(timeline), req.params.id]
    );

    const updated = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const order = parseOrder(updated);

    const io = req.app.get('io');
    if (io) io.emit('orderStatusUpdated', { order, status });

    res.json({ success: true, order });
  } catch (err) {
    console.error('Order status update error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/orders/:id/dispatch
router.patch('/:id/dispatch', (req, res) => {
  try {
    const { deliveryPersonId, courier } = req.body;

    const existing = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });

    const timeline = safeJSON(existing.timeline, []);
    timeline.push({
      status: 'DISPATCHED',
      updatedBy: 'Dispatch Staff',
      updatedAt: new Date().toLocaleString('en-IN')
    });

    runStmt(
      `UPDATE orders SET status = 'DISPATCHED', delivery_person_id = ?, courier = ?, timeline = ?, updated_at = datetime('now') WHERE id = ?`,
      [deliveryPersonId, courier || 'BlueDart', JSON.stringify(timeline), req.params.id]
    );

    const updated = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const order = parseOrder(updated);

    const io = req.app.get('io');
    if (io) io.emit('orderStatusUpdated', { order, status: 'DISPATCHED' });

    res.json({ success: true, order });
  } catch (err) {
    console.error('Order dispatch error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
