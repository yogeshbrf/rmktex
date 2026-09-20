const express = require('express');
const { queryAll, runStmt } = require('../db');

const router = express.Router();

// GET /api/staff
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM staff ORDER BY id ASC');
    const staff = rows.map(s => ({
      id: s.id, code: s.code, name: s.name, role: s.role,
      dept: s.dept, email: s.email, phone: s.phone,
      hub: s.hub, shift: s.shift, status: s.status
    }));
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/staff
router.post('/', (req, res) => {
  try {
    const s = req.body;
    const id = s.id || `STF-${Date.now()}`;
    runStmt(
      `INSERT INTO staff (id, code, name, role, dept, email, phone, hub, shift, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, s.code, s.name, s.role, s.dept, s.email, s.phone, s.hub, s.shift, s.status || 'Active Duty']
    );
    res.status(201).json({ success: true, message: 'Staff member added.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
