const express = require('express');
const { queryAll, queryOne, runStmt } = require('../db');

const router = express.Router();

// GET /api/support/tickets
router.get('/tickets', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM support_tickets ORDER BY created_at DESC');
    const tickets = rows.map(t => ({
      id: t.id, customerId: t.customer_id, customerName: t.customer_name,
      orderId: t.order_id, subject: t.subject, category: t.category,
      priority: t.priority, status: t.status, date: t.date, details: t.details
    }));
    res.json({ success: true, tickets, supportTickets: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/support/tickets
router.post('/tickets', (req, res) => {
  try {
    const t = req.body;
    const id = t.id || `TK${Date.now()}`;
    runStmt(
      `INSERT INTO support_tickets (id, customer_id, customer_name, order_id, subject, category, priority, status, date, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, t.customerId, t.customerName, t.orderId, t.subject, t.category, t.priority || 'Medium', 'Open', t.date || new Date().toLocaleDateString('en-IN'), t.details || null]
    );
    res.status(201).json({ success: true, message: 'Ticket created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/support/tickets/:id/resolve
router.patch('/tickets/:id/resolve', (req, res) => {
  try {
    runStmt(`UPDATE support_tickets SET status = 'Resolved' WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Ticket resolved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
