const express = require('express');
const router = express.Router();

// GET /api/cart — Return empty cart (placeholder for future implementation)
router.get('/', (req, res) => {
  res.json({ success: true, items: [], cart: [], total: 0 });
});

module.exports = router;
