export default async function handler(req, res) {
  const { code } = req.query;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  if (!code) return res.status(400).send('Missing code');

  try {
    const response = await fetch('https://www.tiendanube.com/apps/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!data.access_token) {
      return res.status(400).json({ error: 'Failed to get access token', details: data });
    }

    console.log('✅ Access Token:', data.access_token);
    console.log('🛍️ Store ID:', data.user_id);

    res.send('✅ Conexión exitosa. Ya podés cerrar esta ventana.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno');
  }
}