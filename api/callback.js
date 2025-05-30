const https = require('https');

module.exports = (req, res) => {
  const { code } = req.query;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  if (!code) return res.status(400).send('Missing code');

  const data = JSON.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const options = {
    hostname: 'www.tiendanube.com',
    path: '/apps/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const request = https.request(options, (response) => {
    let body = '';
    response.on('data', (chunk) => (body += chunk));
    response.on('end', () => {
      try {
        const json = JSON.parse(body);
        console.log('✅ Access token:', json.access_token);
        console.log('🛍️ Store ID:', json.user_id);
        res.end('✅ Conexión exitosa. Ya podés cerrar esta ventana.');
      } catch (e) {
        res.status(500).send('Error al parsear respuesta');
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('Error interno');
  });

  request.write(data);
  request.end();
};