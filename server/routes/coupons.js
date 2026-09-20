const express = require('express');
const { queryAll, runStmt } = require('../db');

const router = express.Router();

// GET /api/coupons
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM coupons ORDER BY created_at DESC');
    const coupons = rows.map(c => ({
      id: c.id, code: c.code, discount: c.discount, type: c.type,
      minOrder: c.min_order, expiryDate: c.expiry_date,
      active: !!c.active, usages: c.usages
    }));
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/coupons
router.post('/', (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `CPN-${Date.now()}`;
    runStmt(
      `INSERT INTO coupons (id, code, discount, type, min_order, expiry_date, active, usages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, c.code, c.discount, c.type, c.minOrder || 0, c.expiryDate, c.active ? 1 : 0, c.usages || 0]
    );
    res.status(201).json({ success: true, message: 'Coupon created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
