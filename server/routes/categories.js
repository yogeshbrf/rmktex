const express = require('express');
const { queryAll, queryOne, runStmt } = require('../db');

const router = express.Router();

function safeJSON(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    icon: row.icon,
    desc: row.description,
    description: row.description,
    status: row.status,
    subcategories: safeJSON(row.subcategories, []),
    createdDate: row.created_at
  };
}

// GET /api/categories
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM categories ORDER BY name ASC');
    const categories = rows.map(parseCategory);
    res.json({ success: true, categories, data: categories });
  } catch (err) {
    console.error('Categories list error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/categories/:id
router.get('/:id', (req, res) => {
  try {
    const row = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category: parseCategory(row) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/categories
router.post('/', (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `CAT-${Date.now()}`;
    const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    runStmt(
      `INSERT INTO categories (id, name, slug, image, icon, description, status, subcategories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, c.name, slug, c.image || null, c.icon || null, c.desc || c.description || '', c.status || 'Active', JSON.stringify(c.subcategories || [])]
    );

    const created = queryOne('SELECT * FROM categories WHERE id = ?', [id]);
    const category = parseCategory(created);

    const io = req.app.get('io');
    if (io) io.emit('categoryCreated', { category });

    res.status(201).json({ success: true, category });
  } catch (err) {
    console.error('Category create error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/categories/:id
router.put('/:id', (req, res) => {
  try {
    const c = req.body;
    const updates = [];
    const params = [];

    if (c.name !== undefined) { updates.push('name = ?'); params.push(c.name); }
    if (c.slug !== undefined) { updates.push('slug = ?'); params.push(c.slug); }
    if (c.image !== undefined) { updates.push('image = ?'); params.push(c.image); }
    if (c.icon !== undefined) { updates.push('icon = ?'); params.push(c.icon); }
    if (c.desc !== undefined || c.description !== undefined) { updates.push('description = ?'); params.push(c.desc || c.description); }
    if (c.status !== undefined) { updates.push('status = ?'); params.push(c.status); }
    if (c.subcategories !== undefined) { updates.push('subcategories = ?'); params.push(JSON.stringify(c.subcategories)); }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      params.push(req.params.id);
      runStmt(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updated = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    const category = parseCategory(updated);

    const io = req.app.get('io');
    if (io) io.emit('categoryUpdated', { category });

    res.json({ success: true, category });
  } catch (err) {
    console.error('Category update error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  try {
    runStmt('DELETE FROM categories WHERE id = ?', [req.params.id]);

    const io = req.app.get('io');
    if (io) io.emit('categoryDeleted', { categoryId: req.params.id });

    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    console.error('Category delete error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
