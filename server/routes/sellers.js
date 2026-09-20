const express = require('express');
const { queryAll } = require('../db');

const router = express.Router();

// GET /api/sellers
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM sellers');
    const sellers = rows.map(s => ({
      id: s.id,
      user_id: s.id,
      name: s.name,
      slug: s.slug,
      logo: s.logo,
      rating: s.rating,
      total_products: s.total_products,
      products: s.total_products,
      is_verified: !!s.verified,
      verified: !!s.verified,
      description: s.description
    }));
    res.json({ success: true, sellers, data: sellers });
  } catch (err) {
    console.error('Sellers list error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
