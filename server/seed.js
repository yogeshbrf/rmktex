/**
 * SEED SCRIPT — Migrates all existing data from E-commerce-main into the SQLite database.
 * Run with: node seed.js
 */

const { initDB, runStmt, saveDB, getDB } = require('./db');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const db = await initDB();

  // ─── 1. Read existing product data from E-commerce-main ───────────────────

  const productsJsonPath = path.join(__dirname, '..', 'E-commerce-main', 'dist', 'data', 'products.json');
  const categoriesJsonPath = path.join(__dirname, '..', 'E-commerce-main', 'dist', 'data', 'categories.json');

  let productsData = { sellers: [], products: [] };
  let categoriesData = { categories: [] };

  if (fs.existsSync(productsJsonPath)) {
    productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
    console.log(`✅ Loaded ${productsData.products.length} products from E-commerce-main`);
  } else {
    console.log('⚠️  products.json not found, using fallback data');
  }

  if (fs.existsSync(categoriesJsonPath)) {
    categoriesData = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'));
    console.log(`✅ Loaded ${categoriesData.categories.length} categories from E-commerce-main`);
  } else {
    console.log('⚠️  categories.json not found, using fallback data');
  }

  // ─── 2. Clear existing data ───────────────────────────────────────────────

  const tables = ['products', 'categories', 'sellers', 'users', 'customers', 'orders', 'staff', 'coupons', 'support_tickets', 'refunds'];
  tables.forEach(t => db.run(`DELETE FROM ${t}`));
  console.log('🗑️  Cleared all existing data\n');

  // ─── 3. Seed Sellers ──────────────────────────────────────────────────────

  (productsData.sellers || []).forEach(s => {
    runStmt(
      `INSERT OR REPLACE INTO sellers (id, name, slug, logo, rating, total_products, verified, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.slug, s.logo, s.rating, s.total_products || s.products, (s.verified || s.is_verified) ? 1 : 0, s.description]
    );
  });
  console.log(`📦 Seeded ${(productsData.sellers || []).length} sellers`);

  // ─── 4. Seed Categories ───────────────────────────────────────────────────

  // From E-commerce-main storefront
  (categoriesData.categories || []).forEach(c => {
    runStmt(
      `INSERT OR REPLACE INTO categories (id, name, slug, image, icon, description, status, subcategories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [String(c.id), c.name, c.slug, c.image, null, `${c.name} collection`, 'Active', JSON.stringify(c.subcategories || [])]
    );
  });

  // From E-commerce-dashboard
  const dashboardCategories = [
    { id: 'CAT-1', name: 'Pure Silk Sarees', icon: 'fa-shirt', desc: 'Handcrafted Kanchipuram, Banarasi & Mysore Silks' },
    { id: 'CAT-2', name: 'Mens Traditional Apparel', icon: 'fa-user-tie', desc: 'Dhotis, Kurta Sets & Silk Shirts' },
    { id: 'CAT-3', name: 'Womens Ethnic Wear', icon: 'fa-child-dress', desc: 'Kurtis, Anarkalis & Dupattas' },
    { id: 'CAT-4', name: 'Home & Bedding Textiles', icon: 'fa-bed', desc: 'Bedlinen, Towels & Cushion Covers' }
  ];
  dashboardCategories.forEach(c => {
    runStmt(
      `INSERT OR REPLACE INTO categories (id, name, slug, image, icon, description, status, subcategories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.name, c.id.toLowerCase().replace(/[^a-z0-9]/g, '-'), null, c.icon, c.desc, 'Active', '[]']
    );
  });
  console.log(`📁 Seeded ${(categoriesData.categories || []).length + dashboardCategories.length} categories`);

  // ─── 5. Seed Products ─────────────────────────────────────────────────────

  (productsData.products || []).forEach(p => {
    runStmt(
      `INSERT OR REPLACE INTO products (
        id, sku, name, slug, price, compare_price, discount, stock, status,
        image, images, category, category_name, subcategory,
        seller_id, seller_name, seller_slug, seller_verified,
        description, rating, reviews, review_count, sales,
        colors, sizes, tags, material, fit, specifications, variants,
        is_new, is_bestseller, is_trending, delivery_days, free_shipping
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(p.id), p.sku || p.product_id, p.name, p.slug,
        p.price, p.compare_price || p.comparePrice, p.discount || 0,
        p.stock || p.stock_quantity || 0, p.status || 'In Stock',
        p.image, JSON.stringify(p.images || []),
        p.category || p.category_name, p.category_name || p.category, p.subcategory || null,
        p.seller_id || p.sellerId, p.seller_name, p.seller_slug, p.seller_verified ? 1 : 0,
        p.description, p.rating || 0, p.reviews || p.review_count || 0, p.review_count || p.reviews || 0, p.sales || 0,
        JSON.stringify(p.colors || []), JSON.stringify(p.sizes || []), JSON.stringify(p.tags || []),
        p.material, p.fit, JSON.stringify(p.specifications || {}), JSON.stringify(p.variants || []),
        (p.is_new || p.isNew) ? 1 : 0, (p.is_bestseller || p.isBestseller) ? 1 : 0, (p.is_trending || p.isTrending) ? 1 : 0,
        p.delivery_days || p.deliveryDays || 3, (p.free_shipping || p.freeShipping) ? 1 : 0
      ]
    );
  });
  console.log(`🛍️  Seeded ${(productsData.products || []).length} products`);

  // ─── 6. Seed Users ────────────────────────────────────────────────────────

  const userSeeds = [
    { email: 'admin@rmktextiles.com', password: 'admin123', role: 'admin', name: 'Admin Manager', code: 'Super Admin' },
    { email: 'warehouse@rmktextiles.com', password: 'warehouse123', role: 'warehouse', name: 'Warehouse Supervisor', code: 'WS001' },
    { email: 'dispatch@rmktextiles.com', password: 'dispatch123', role: 'dispatch', name: 'Dispatch Controller', code: 'DP001' },
    { email: 'delivery@rmktextiles.com', password: 'delivery123', role: 'delivery', name: 'Vikram R.', code: 'DL001' },
    { email: 'support@rmktextiles.com', password: 'support123', role: 'support', name: 'Support Lead', code: 'SP001' },
    { email: 'finance@rmktextiles.com', password: 'finance123', role: 'finance', name: 'Finance Controller', code: 'FN001' }
  ];

  userSeeds.forEach(u => {
    const hash = bcrypt.hashSync(u.password, 10);
    runStmt(
      `INSERT OR REPLACE INTO users (email, password_hash, role, name, staff_code) VALUES (?, ?, ?, ?, ?)`,
      [u.email, hash, u.role, u.name, u.code]
    );
  });
  console.log(`👤 Seeded ${userSeeds.length} user accounts`);

  // ─── 7. Seed Customers ────────────────────────────────────────────────────

  const customers = [
    { id: 'CUS001', name: 'Rahul S.', email: 'rahul.s@example.com', phone: '+91 98765 43210', city: 'Salem', state: 'Tamil Nadu', address: '12, South Car Street, Salem - 636001', ordersCount: 4, totalSpent: 14500, status: 'VIP Member' },
    { id: 'CUS002', name: 'Anitha M.', email: 'anitha.m@example.com', phone: '+91 98765 11223', city: 'Chennai', state: 'Tamil Nadu', address: '45, Anna Salai, T. Nagar, Chennai - 600017', ordersCount: 2, totalSpent: 6800, status: 'Active' },
    { id: 'CUS003', name: 'Suresh Kumar', email: 'suresh.k@example.com', phone: '+91 98123 45678', city: 'Coimbatore', state: 'Tamil Nadu', address: '88, Cross Cut Road, Gandhipuram, Coimbatore - 641012', ordersCount: 5, totalSpent: 28400, status: 'VIP Member' },
    { id: 'CUS004', name: 'Priya R.', email: 'priya.r@example.com', phone: '+91 99887 76655', city: 'Madurai', state: 'Tamil Nadu', address: '19, KK Nagar, Madurai - 625020', ordersCount: 3, totalSpent: 9999, status: 'Active' },
    { id: 'CUS005', name: 'Kavitha P.', email: 'kavitha.p@example.com', phone: '+91 97766 55443', city: 'Trichy', state: 'Tamil Nadu', address: '22, Thillai Nagar, Trichy - 620018', ordersCount: 1, totalSpent: 2598, status: 'Active' }
  ];

  customers.forEach(c => {
    runStmt(
      `INSERT OR REPLACE INTO customers (id, name, email, phone, city, state, address, orders_count, total_spent, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.name, c.email, c.phone, c.city, c.state, c.address, c.ordersCount, c.totalSpent, c.status]
    );
  });
  console.log(`👥 Seeded ${customers.length} customers`);

  // ─── 8. Seed Orders ───────────────────────────────────────────────────────

  const orders = [
    {
      id: 'ATD1001', customerId: 'CUS001', customerName: 'Rahul S.', phone: '+91 98765 43210', city: 'Salem',
      address: '12, South Car Street, Salem - 636001',
      items: [{ name: 'Pure Silk Kanchipuram Saree (Blue)', qty: 2, price: '₹1,299' }, { name: 'Cotton Dhoti & Shirt Set', qty: 1, price: '₹1,499' }],
      amount: 14497, paymentMethod: 'UPI', paymentStatus: 'Paid', status: 'CONFIRMED',
      orderDate: '17 Sep 2026 10:00 AM', estimatedDelivery: '20 Sep 2026', courier: 'BlueDart', deliveryPersonId: 'STF-04',
      timeline: [{ status: 'ORDER_PLACED', updatedBy: 'System', updatedAt: '17 Sep 2026 10:00 AM' }, { status: 'CONFIRMED', updatedBy: 'Admin Staff', updatedAt: '17 Sep 2026 10:15 AM' }]
    }
  ];

  orders.forEach(o => {
    runStmt(
      `INSERT OR REPLACE INTO orders (id, customer_id, customer_name, phone, city, address, items, amount, payment_method, payment_status, status, order_date, estimated_delivery, courier, delivery_person_id, timeline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [o.id, o.customerId, o.customerName, o.phone, o.city, o.address, JSON.stringify(o.items), o.amount, o.paymentMethod, o.paymentStatus, o.status, o.orderDate, o.estimatedDelivery, o.courier, o.deliveryPersonId, JSON.stringify(o.timeline)]
    );
  });
  console.log(`📋 Seeded ${orders.length} orders`);

  // ─── 9. Seed Staff ────────────────────────────────────────────────────────

  const staffMembers = [
    { id: 'STF-01', code: 'Super Admin', name: 'Admin Manager', role: 'admin', dept: 'System Admin', email: 'admin@rmktextiles.com', phone: '+91 98765 00001', hub: 'Central HQ Salem', shift: 'General (9 AM - 6 PM)', status: 'Active Duty' },
    { id: 'STF-02', code: 'WS001', name: 'Warehouse Supervisor', role: 'warehouse', dept: 'Fulfillment & Packing', email: 'warehouse@rmktextiles.com', phone: '+91 98765 00002', hub: 'Salem Logistics Hub', shift: 'Morning (6 AM - 2 PM)', status: 'Active Duty' },
    { id: 'STF-03', code: 'DP001', name: 'Dispatch Controller', role: 'dispatch', dept: 'Logistics & Shipping', email: 'dispatch@rmktextiles.com', phone: '+91 98765 00003', hub: 'Salem Logistics Hub', shift: 'Day (10 AM - 7 PM)', status: 'Active Duty' },
    { id: 'STF-04', code: 'DL001', name: 'Vikram R.', role: 'delivery', dept: 'Last-Mile Delivery', email: 'delivery@rmktextiles.com', phone: '+91 98765 00004', hub: 'Salem City Zone 1', shift: 'Field Shift', status: 'Active Duty' },
    { id: 'STF-05', code: 'SP001', name: 'Support Lead', role: 'support', dept: 'Customer Experience', email: 'support@rmktextiles.com', phone: '+91 98765 00005', hub: 'Central HQ Salem', shift: 'Rotational', status: 'Active Duty' },
    { id: 'STF-06', code: 'FN001', name: 'Finance Controller', role: 'finance', dept: 'Accounts & Audit', email: 'finance@rmktextiles.com', phone: '+91 98765 00006', hub: 'Central HQ Salem', shift: 'General (9 AM - 6 PM)', status: 'Active Duty' }
  ];

  staffMembers.forEach(s => {
    runStmt(
      `INSERT OR REPLACE INTO staff (id, code, name, role, dept, email, phone, hub, shift, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.code, s.name, s.role, s.dept, s.email, s.phone, s.hub, s.shift, s.status]
    );
  });
  console.log(`🏢 Seeded ${staffMembers.length} staff members`);

  // ─── 10. Seed Coupons ─────────────────────────────────────────────────────

  const coupons = [
    { id: 'CPN-101', code: 'FESTIVE20', discount: '20% OFF', type: 'Percentage', minOrder: 2000, expiryDate: '31 Oct 2026', active: 1, usages: 420 },
    { id: 'CPN-102', code: 'SILK500', discount: '₹500 Flat', type: 'Fixed Amount', minOrder: 5000, expiryDate: '15 Nov 2026', active: 1, usages: 185 }
  ];

  coupons.forEach(c => {
    runStmt(
      `INSERT OR REPLACE INTO coupons (id, code, discount, type, min_order, expiry_date, active, usages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.code, c.discount, c.type, c.minOrder, c.expiryDate, c.active, c.usages]
    );
  });
  console.log(`🎟️  Seeded ${coupons.length} coupons`);

  // ─── 11. Seed Support Tickets ─────────────────────────────────────────────

  runStmt(
    `INSERT OR REPLACE INTO support_tickets (id, customer_id, customer_name, order_id, subject, category, priority, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['TK1001', 'CUS004', 'Priya R.', 'ATD1004', 'Size exchange request for saree blouse piece', 'Return', 'High', 'Open', '17 Sep 2026']
  );
  console.log(`🎫 Seeded 1 support ticket`);

  // ─── 12. Seed Refunds ─────────────────────────────────────────────────────

  runStmt(
    `INSERT OR REPLACE INTO refunds (id, order_id, customer_name, amount, pay_method, reason, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['RFD-501', 'ATD1008', 'Ganesh V.', 11499, 'COD', 'Failed Delivery / RTO', 'Pending', '16 Sep 2026']
  );
  console.log(`💰 Seeded 1 refund`);

  // ─── Done ─────────────────────────────────────────────────────────────────

  saveDB();
  console.log('\n✅ Database seeded successfully!');
  console.log(`📍 Database location: ${require('path').join(__dirname, 'data', 'ecommerce.db')}`);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
