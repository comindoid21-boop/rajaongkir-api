const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = '3ZaDDtnZ316b3ee9d0b439ebIoLinjma';

app.all('/api/*', (req, res) => {
  const path = req.path.replace('/api', '') || '/';
  const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
  
  const options = {
    hostname: 'api.rajaongkir.com',
    port: 443,
    path: `/api${path}${query}`,
    method: req.method,
    headers: {
      'key': API_KEY,
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', chunk => data += chunk);
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxyReq.on('error', (e) => res.status(500).json({ error: e.message }));
  
  if (['POST', 'PUT'].includes(req.method) && req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
});

app.listen(3000, () => console.log('Proxy running'));
