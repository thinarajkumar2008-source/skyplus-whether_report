const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envRaw = fs.readFileSync(envPath, 'utf8');
    envRaw.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          const v = trimmed.slice(eqIdx + 1).trim();
          if (k && !(k in process.env)) {
            process.env[k] = v;
          }
        }
      }
    });
  }
} catch (e) {
  console.warn('[Server] Could not parse .env:', e.message);
}

const PORT = process.env.PORT || 3000;

// Custom HTTPS agent to handle corporate firewall & proxy certificates
const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Global process crash prevention guards
process.on('uncaughtException', (err) => {
  console.warn('[Server Guard] Caught unhandled exception (prevented crash):', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[Server Guard] Caught unhandled rejection (prevented crash):', reason);
});

const server = http.createServer((req, res) => {
  req.on('error', (err) => console.warn('[Request Error]:', err.message));
  res.on('error', (err) => console.warn('[Response Error]:', err.message));

  // Modern WHATWG URL parsing
  let reqUrl;
  try {
    reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Proxy Endpoint to bypass browser CORS & firewall SSL inspection errors
  if (reqUrl.pathname === '/api/proxy') {
    const targetUrl = reqUrl.searchParams.get('url');
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing url parameter' }));
      return;
    }

    try {
      const parsedTarget = new URL(targetUrl);
      const isHttps = parsedTarget.protocol === 'https:';
      const client = isHttps ? https : http;
      const options = {
        agent: isHttps ? agent : undefined,
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkyPulseWeather/1.0',
          'Accept': 'application/json'
        }
      };

      const proxyReq = client.get(targetUrl, options, (proxyRes) => {
        let responseBody = '';
        proxyRes.on('data', chunk => {
          responseBody += chunk;
        });

        proxyRes.on('end', () => {
          if (!res.writableEnded) {
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': proxyRes.headers['content-type'] || 'application/json'
            });
            res.end(responseBody);
          }
        });

        proxyRes.on('error', (err) => {
          if (!res.writableEnded) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      proxyReq.on('error', (err) => {
        console.warn('Proxy request failed:', targetUrl, '->', err.message);
        if (!res.writableEnded) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        if (!res.writableEnded) {
          res.writeHead(504, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Gateway timeout' }));
        }
      });
    } catch (err) {
      if (!res.writableEnded) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid URL format' }));
      }
    }
    return;
  }

  // Safe Public Configuration Endpoint (Supabase public anon key / OWM presence)
  if (reqUrl.pathname === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      hasOwmKey: !!process.env.OPENWEATHERMAP_API_KEY
    }));
    return;
  }

  // Dual API Fallback Proxy Endpoint: OpenWeatherMap (keeps server API key secure)
  if (reqUrl.pathname === '/api/weather/owm') {
    const lat = reqUrl.searchParams.get('lat');
    const lon = reqUrl.searchParams.get('lon');
    const clientKey = reqUrl.searchParams.get('apiKey');
    const apiKey = clientKey || process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'OpenWeatherMap API key not configured', configured: false }));
      return;
    }

    if (!lat || !lon) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing lat or lon parameters' }));
      return;
    }

    const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${encodeURIComponent(apiKey)}`;
    const options = {
      agent: agent,
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    };

    const owmReq = https.get(owmUrl, options, (owmRes) => {
      let body = '';
      owmRes.on('data', chunk => { body += chunk; });
      owmRes.on('end', () => {
        if (!res.writableEnded) {
          res.writeHead(owmRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(body);
        }
      });
      owmRes.on('error', (err) => {
        if (!res.writableEnded) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OpenWeatherMap upstream error: ' + err.message }));
        }
      });
    });

    owmReq.on('error', (err) => {
      if (!res.writableEnded) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to contact OpenWeatherMap: ' + err.message }));
      }
    });

    owmReq.on('timeout', () => {
      owmReq.destroy();
      if (!res.writableEnded) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'OpenWeatherMap request timeout' }));
      }
    });
    return;
  }

  // Static File Serving & SPA Fallback
  let cleanUrl = reqUrl.pathname;
  let ext = path.extname(cleanUrl);

  // If request has no extension or is a known SPA route, serve index.html
  const isSpaRoute = !ext || ['/login', '/signup', '/forgot-password', '/account'].includes(cleanUrl);
  let filePath = isSpaRoute 
    ? path.join(__dirname, 'index.html') 
    : path.join(__dirname, cleanUrl);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for client-side routing
        fs.readFile(path.join(__dirname, 'index.html'), (spaErr, spaContent) => {
          if (!spaErr) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(spaContent);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`SkyPulse Weather App running at:`);
  console.log(`  > http://localhost:${PORT}`);
  console.log(`  > http://127.0.0.1:${PORT}`);
  console.log(`  > Weather proxy active at /api/proxy`);
});
