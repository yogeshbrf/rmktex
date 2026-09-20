const express = require('express');
const { queryAll, runStmt } = require('../db');

const router = express.Router();

// GET /api/refunds
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM refunds ORDER BY created_at DESC');
    const refunds = rows.map(r => ({
      id: r.id, orderId: r.order_id, customerName: r.customer_name,
      amount: r.amount, payMethod: r.pay_method, reason: r.reason,
      status: r.status, date: r.date
    }));
    res.json({ success: true, refunds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/refunds/:id/process
router.patch('/:id/process', (req, res) => {
  try {
    runStmt(`UPDATE refunds SET status = 'Completed' WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Refund processed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
