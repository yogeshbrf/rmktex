/**
 * CENTRALIZED E-COMMERCE BACKEND SERVER
 * Express + Socket.IO + SQLite
 * Serves as the single source of truth for both E-commerce-main and E-commerce-dashboard.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');
const { requireAuth, optionalAuth } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// ─── Socket.IO ──────────────────────────────────────────────────────────────

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// Make io accessible to route handlers
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`⚡ Client disconnected: ${socket.id}`);
  });
});

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve product images from E-commerce-main dist/imgs
const imgsPath = path.join(__dirname, '..', 'E-commerce-main', 'dist', 'imgs');
app.use('/imgs', express.static(imgsPath));
app.use('/api/imgs', express.static(imgsPath));

// Serve uploads directory for admin-uploaded images
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Serve E-commerce-dashboard as static site at /dashboard
const dashboardPath = path.join(__dirname, '..', 'E-commerce-dashboard');
app.use('/dashboard', express.static(dashboardPath));

// ─── API Routes ─────────────────────────────────────────────────────────────

// Auth (public)
app.use('/api/auth', require('./routes/auth'));

// Public read routes (storefront needs these without auth)
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/cart', require('./routes/cart'));

// Dashboard routes (read is open for store.js fetch, mutations should ideally use auth)
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/support', require('./routes/support'));
app.use('/api/refunds', require('./routes/refunds'));

// ─── Health Check ───────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'E-Commerce Central Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'E-Commerce Central Backend' });
});

// ─── Start Server ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await initDB();
    console.log('✅ Database initialized');

    server.listen(PORT, () => {
      console.log(`\n🚀 Central Backend Server running on http://localhost:${PORT}`);
      console.log(`📡 Socket.IO ready for real-time connections`);
      console.log(`📁 Serving product images from: ${imgsPath}`);
      console.log(`🎛️  Dashboard available at: http://localhost:${PORT}/dashboard`);
      console.log(`\n📋 API Endpoints:`);
      console.log(`   GET  /api/products        — List all products`);
      console.log(`   GET  /api/categories       — List all categories`);
      console.log(`   GET  /api/sellers          — List all sellers`);
      console.log(`   GET  /api/orders           — List all orders`);
      console.log(`   POST /api/auth/login       — Authenticate user`);
      console.log(`   GET  /api/health           — Health check\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
