import http from 'http';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = req.url || '';

  // Health check
  if (reqUrl === '/api/health' || reqUrl === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'E-Commerce Proxy Server' }));
    return;
  }

  // Forward ALL /api requests to Central Backend on port 5000
  const path = reqUrl.startsWith('/api') ? reqUrl : `/api${reqUrl}`;
  const targetUrl = `${BACKEND_URL}${path}`;

  let bodyChunks = [];
  req.on('data', chunk => bodyChunks.push(chunk));
  req.on('end', () => {
    const reqBody = Buffer.concat(bodyChunks);

    const proxyReq = http.request(targetUrl, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] || 'application/json',
        'authorization': req.headers['authorization'] || ''
      }
    }, (proxyRes) => {
      let respChunks = [];
      proxyRes.on('data', chunk => respChunks.push(chunk));
      proxyRes.on('end', () => {
        const respBuffer = Buffer.concat(respChunks);
        res.writeHead(proxyRes.statusCode || 200, {
          'Content-Type': proxyRes.headers['content-type'] || 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(respBuffer);
      });
    });

    proxyReq.on('error', (err) => {
      console.warn('Central Backend unreachable:', err.message);
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Central backend is offline. Please start the server at port 5000.',
        products: [],
        categories: [],
        sellers: []
      }));
    });

    if (reqBody.length > 0) {
      proxyReq.write(reqBody);
    }
    proxyReq.end();
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`E-Commerce API Proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding requests to Central Backend at ${BACKEND_URL}`);
});
