const path = require('path');

// Helper to resolve dependencies from either root node_modules or server/node_modules
function resolveModule(name) {
  try {
    return require(name);
  } catch (e) {
    return require(path.join(__dirname, '..', 'server', 'node_modules', name));
  }
}

const express = resolveModule('express');
const cors = resolveModule('cors');
const { initDB } = require('../server/db');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve product images if requested through /api/imgs or /imgs
const imgsPath = path.join(__dirname, '..', 'E-commerce-main', 'dist', 'imgs');
app.use('/imgs', express.static(imgsPath));
app.use('/api/imgs', express.static(imgsPath));

// Mock socket.io for serverless function environment
const mockIo = {
  emit: () => {},
  to: () => ({ emit: () => {} })
};
app.set('io', mockIo);

// Ensure DB is initialized before handling any route
let dbInitPromise = null;
app.use(async (req, res, next) => {
  try {
    if (!dbInitPromise) {
      dbInitPromise = initDB();
    }
    await dbInitPromise;
    next();
  } catch (err) {
    console.error('Database initialization error:', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

// API Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/products', require('../server/routes/products'));
app.use('/api/categories', require('../server/routes/categories'));
app.use('/api/sellers', require('../server/routes/sellers'));
app.use('/api/cart', require('../server/routes/cart'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/customers', require('../server/routes/customers'));
app.use('/api/staff', require('../server/routes/staff'));
app.use('/api/coupons', require('../server/routes/coupons'));
app.use('/api/support', require('../server/routes/support'));
app.use('/api/refunds', require('../server/routes/refunds'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'E-Commerce Central Backend (Vercel Serverless)',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
