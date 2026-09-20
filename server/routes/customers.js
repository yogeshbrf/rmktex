const express = require('express');
const { queryAll, queryOne, runStmt } = require('../db');

const router = express.Router();

// GET /api/customers
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM customers ORDER BY name ASC');
    const customers = rows.map(c => ({
      id: c.id, name: c.name, email: c.email, phone: c.phone,
      city: c.city, state: c.state, address: c.address,
      ordersCount: c.orders_count, totalSpent: c.total_spent, status: c.status
    }));
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/customers
router.post('/', (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `CUS${Date.now()}`;
    runStmt(
      `INSERT INTO customers (id, name, email, phone, city, state, address, orders_count, total_spent, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, c.name, c.email, c.phone, c.city, c.state, c.address, c.ordersCount || 0, c.totalSpent || 0, c.status || 'Active']
    );
    res.status(201).json({ success: true, message: 'Customer created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
