import https from 'https';
import querystring from 'querystring';

export default async function handler(req, res) {
  const code = req.query.code;

  const data = querystring.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.REDIRECT_URI
  });

  const options = {
    hostname: 'www.tiendanube.com',
    path: '/apps/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
  };

  const request = https.request(options, response => {
    let body = '';
    response.on('data', chunk => {
      body += chunk;
    });
    response.on('end', () => {
      try {
        const json = JSON.parse(body);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json, null, 2));
      } catch (error) {
        console.error("❌ Error al parsear respuesta:", error.message);
        res.setHeader('Content-Type', 'text/plain');
        res.end("❌ Error al parsear respuesta:\n\n" + body);
      }
    });
  });

  request.on('error', error => {
    console.error("Request error:", error);
    res.status(500).json({ error: 'Request failed', details: error.message });
  });

  request.write(data);
  request.end();
}