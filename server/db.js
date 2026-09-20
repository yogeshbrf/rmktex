/**
 * SQLite Database Module (sql.js — pure JavaScript, no native compilation)
 * Provides synchronous-like API via a pre-initialized singleton.
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'ecommerce.db');
const dataDir = path.dirname(DB_PATH);

let db = null;

/**
 * Initialize the database. Must be called (and awaited) before any queries.
 * Returns the db instance.
 */
async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing DB file if present, otherwise create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    db = new SQL.Database();
  }

  // Create schema
  db.run(`
    CREATE TABLE IF NOT EXISTS sellers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      logo TEXT,
      rating REAL DEFAULT 0,
      total_products INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      image TEXT,
      icon TEXT,
      description TEXT,
      status TEXT DEFAULT 'Active',
      subcategories TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT,
      name TEXT NOT NULL,
      slug TEXT,
      price REAL NOT NULL,
      compare_price REAL,
      discount REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      status TEXT DEFAULT 'In Stock',
      image TEXT,
      images TEXT DEFAULT '[]',
      category TEXT,
      category_name TEXT,
      subcategory TEXT,
      seller_id INTEGER,
      seller_name TEXT,
      seller_slug TEXT,
      seller_verified INTEGER DEFAULT 0,
      description TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      sales INTEGER DEFAULT 0,
      colors TEXT DEFAULT '[]',
      sizes TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      material TEXT,
      fit TEXT,
      specifications TEXT DEFAULT '{}',
      variants TEXT DEFAULT '[]',
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      delivery_days INTEGER DEFAULT 3,
      free_shipping INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT,
      staff_code TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      city TEXT,
      state TEXT,
      address TEXT,
      orders_count INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      status TEXT DEFAULT 'Active',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT,
      phone TEXT,
      city TEXT,
      address TEXT,
      items TEXT DEFAULT '[]',
      amount REAL DEFAULT 0,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'Pending',
      status TEXT DEFAULT 'Processing',
      order_date TEXT,
      estimated_delivery TEXT,
      courier TEXT,
      delivery_person_id TEXT,
      timeline TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT NOT NULL,
      role TEXT,
      dept TEXT,
      email TEXT,
      phone TEXT,
      hub TEXT,
      shift TEXT,
      status TEXT DEFAULT 'Active Duty',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE,
      discount TEXT,
      type TEXT,
      min_order REAL DEFAULT 0,
      expiry_date TEXT,
      active INTEGER DEFAULT 1,
      usages INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT,
      order_id TEXT,
      subject TEXT,
      category TEXT,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Open',
      date TEXT,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      customer_name TEXT,
      amount REAL DEFAULT 0,
      pay_method TEXT,
      reason TEXT,
      status TEXT DEFAULT 'Pending',
      date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Save to disk
  saveDB();

  return db;
}

/**
 * Save the in-memory database to disk.
 */
function saveDB() {
  if (!db) return;
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Get the database instance (must call initDB first).
 */
function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}

/**
 * Helper: Run a SELECT and return rows as an array of objects.
 */
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

/**
 * Helper: Run a SELECT and return the first row as an object, or null.
 */
function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Helper: Run an INSERT/UPDATE/DELETE statement.
 */
function runStmt(sql, params = []) {
  db.run(sql, params);
  saveDB();
}

module.exports = { initDB, getDB, saveDB, queryAll, queryOne, runStmt };
