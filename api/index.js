const fs = require('fs');
const path = require('path');

function getJsonData(filename) {
  const candidates = [
    path.join(__dirname, '..', 'dist', 'data', filename),
    path.join(__dirname, '..', 'dist', 'api', filename),
    path.join(__dirname, '..', 'E-commerce-main', 'dist', 'data', filename)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        return JSON.parse(fs.readFileSync(c, 'utf8'));
      } catch (e) {}
    }
  }
  return null;
}

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = (req.url || '').split('?')[0];

  // Health
  if (url === '/api/health' || url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ status: 'ok', service: 'E-Commerce Central Backend' }));
  }

  // Products
  if (url.startsWith('/api/products') || url.startsWith('/products')) {
    const data = getJsonData('products.json');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data || { success: true, products: [] }));
  }

  // Categories
  if (url.startsWith('/api/categories') || url.startsWith('/categories')) {
    const data = getJsonData('categories.json');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data || { success: true, categories: [] }));
  }

  // Sellers
  if (url.startsWith('/api/sellers') || url.startsWith('/sellers')) {
    const data = getJsonData('products.json');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, sellers: (data && data.sellers) || [] }));
  }

  // Auth login for dashboard
  if (url.startsWith('/api/auth/login')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const role = parsed.role || 'admin';
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: true,
          token: 'mock-auth-token-2026',
          user: {
            id: 1,
            email: parsed.email || 'admin@rmktextiles.com',
            name: role === 'admin' ? 'Admin Manager' : 'Operations Staff',
            role: role,
            code: 'STF-01'
          }
        }));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ success: false, message: 'Invalid JSON request' }));
      }
    });
    return;
  }

  // Orders
  if (url.startsWith('/api/orders') || url.startsWith('/orders')) {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: true,
      orders: [
        {
          id: 'ORD-1001',
          customerName: 'Rahul S.',
          phone: '+91 98765 43210',
          city: 'Salem',
          status: 'Processing',
          amount: 2499,
          items: []
        }
      ]
    }));
  }

  // Default fallback
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ success: true, message: 'API active' }));
};
