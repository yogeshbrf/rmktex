const express = require('express');
const { queryAll, queryOne, runStmt } = require('../db');

const router = express.Router();

/**
 * Parse JSON fields from a product row into proper objects/arrays.
 */
function parseProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    sku: row.sku,
    product_id: row.sku,
    productId: row.sku,
    name: row.name,
    slug: row.slug,
    price: row.price,
    compare_price: row.compare_price,
    comparePrice: row.compare_price,
    discount: row.discount,
    stock: row.stock,
    stock_quantity: row.stock,
    status: row.status,
    image: row.image,
    images: safeJSON(row.images, []),
    category: row.category,
    category_name: row.category_name || row.category,
    subcategory: row.subcategory,
    seller_id: row.seller_id,
    sellerId: row.seller_id,
    seller_name: row.seller_name,
    seller_slug: row.seller_slug,
    seller_verified: !!row.seller_verified,
    description: row.description,
    rating: row.rating,
    reviews: row.reviews,
    review_count: row.review_count,
    sales: row.sales,
    colors: safeJSON(row.colors, []),
    sizes: safeJSON(row.sizes, []),
    tags: safeJSON(row.tags, []),
    material: row.material,
    fit: row.fit,
    specifications: safeJSON(row.specifications, {}),
    variants: safeJSON(row.variants, []),
    is_new: !!row.is_new,
    isNew: !!row.is_new,
    is_bestseller: !!row.is_bestseller,
    isBestseller: !!row.is_bestseller,
    is_trending: !!row.is_trending,
    isTrending: !!row.is_trending,
    delivery_days: row.delivery_days,
    deliveryDays: row.delivery_days,
    free_shipping: !!row.free_shipping,
    freeShipping: !!row.free_shipping
  };
}

function safeJSON(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// GET /api/products — List all products
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map(parseProduct);
    res.json({ success: true, products, data: products });
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/products/:id — Get single product
router.get('/:id', (req, res) => {
  try {
    const row = queryOne('SELECT * FROM products WHERE id = ? OR sku = ?', [req.params.id, req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product: parseProduct(row) });
  } catch (err) {
    console.error('Product get error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/products — Create product
router.post('/', (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `PRD-${Date.now()}`;
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    runStmt(
      `INSERT INTO products (
        id, sku, name, slug, price, compare_price, discount, stock, status,
        image, images, category, category_name, subcategory,
        seller_id, seller_name, seller_slug, seller_verified,
        description, rating, reviews, review_count, sales,
        colors, sizes, tags, material, fit, specifications, variants,
        is_new, is_bestseller, is_trending, delivery_days, free_shipping
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.sku || id, p.name, slug,
        p.price || 0, p.compare_price || p.comparePrice || null, p.discount || 0,
        p.stock || 0, p.status || (p.stock > 0 ? 'In Stock' : 'Out of Stock'),
        p.image || null, JSON.stringify(p.images || []),
        p.category || p.category_name || null, p.category_name || p.category || null, p.subcategory || null,
        p.seller_id || p.sellerId || null, p.seller_name || null, p.seller_slug || null, p.seller_verified ? 1 : 0,
        p.description || null, p.rating || 0, p.reviews || 0, p.review_count || 0, p.sales || 0,
        JSON.stringify(p.colors || []), JSON.stringify(p.sizes || []), JSON.stringify(p.tags || []),
        p.material || null, p.fit || null, JSON.stringify(p.specifications || {}), JSON.stringify(p.variants || []),
        p.is_new ? 1 : 0, p.is_bestseller ? 1 : 0, p.is_trending ? 1 : 0,
        p.delivery_days || 3, p.free_shipping ? 1 : 0
      ]
    );

    const created = queryOne('SELECT * FROM products WHERE id = ?', [id]);
    const product = parseProduct(created);

    // Emit Socket.IO event
    const io = req.app.get('io');
    if (io) io.emit('productCreated', { product });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Product create error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/products/:id — Update product
router.put('/:id', (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });

    const p = req.body;
    const updates = [];
    const params = [];

    const fields = {
      name: p.name, sku: p.sku, slug: p.slug, price: p.price,
      compare_price: p.compare_price || p.comparePrice,
      discount: p.discount, stock: p.stock, status: p.status,
      image: p.image, category: p.category || p.category_name,
      category_name: p.category_name || p.category,
      subcategory: p.subcategory, description: p.description,
      rating: p.rating, reviews: p.reviews, review_count: p.review_count,
      sales: p.sales, material: p.material, fit: p.fit,
      delivery_days: p.delivery_days, free_shipping: p.free_shipping != null ? (p.free_shipping ? 1 : 0) : undefined,
      is_new: p.is_new != null ? (p.is_new ? 1 : 0) : undefined,
      is_bestseller: p.is_bestseller != null ? (p.is_bestseller ? 1 : 0) : undefined,
      is_trending: p.is_trending != null ? (p.is_trending ? 1 : 0) : undefined,
      seller_id: p.seller_id, seller_name: p.seller_name, seller_slug: p.seller_slug,
      seller_verified: p.seller_verified != null ? (p.seller_verified ? 1 : 0) : undefined,
    };

    // JSON fields
    const jsonFields = {
      images: p.images, colors: p.colors, sizes: p.sizes,
      tags: p.tags, specifications: p.specifications, variants: p.variants
    };

    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        updates.push(`${key} = ?`);
        params.push(val);
      }
    }

    for (const [key, val] of Object.entries(jsonFields)) {
      if (val !== undefined) {
        updates.push(`${key} = ?`);
        params.push(JSON.stringify(val));
      }
    }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      params.push(req.params.id);
      runStmt(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updated = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const product = parseProduct(updated);

    const io = req.app.get('io');
    if (io) io.emit('productUpdated', { product });

    res.json({ success: true, product });
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/products/:id/stock — Update stock only
router.patch('/:id/stock', (req, res) => {
  try {
    const { stock } = req.body;
    const stockVal = Number(stock);
    const status = stockVal === 0 ? 'Out of Stock' : (stockVal < 10 ? 'Low Stock' : 'In Stock');

    runStmt(
      `UPDATE products SET stock = ?, status = ?, updated_at = datetime('now') WHERE id = ?`,
      [stockVal, status, req.params.id]
    );

    const io = req.app.get('io');
    if (io) io.emit('productStockUpdated', { productId: req.params.id, stock: stockVal, status });

    res.json({ success: true, productId: req.params.id, stock: stockVal, status });
  } catch (err) {
    console.error('Stock update error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/products/:id — Delete product
router.delete('/:id', (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });

    runStmt('DELETE FROM products WHERE id = ?', [req.params.id]);

    const io = req.app.get('io');
    if (io) io.emit('productDeleted', { productId: req.params.id });

    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
