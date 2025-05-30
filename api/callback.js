export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Falta el parámetro 'code' en la URL" });
  }

  const tokenUrl = 'https://www.tiendanube.com/apps/token';

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'GrowthLoopApp (juan@redhookdata.com)'
      },
      body: body.toString()
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return res.status(500).json({
        error: 'Respuesta no válida del servidor de Tiendanube',
        raw: text
      });
    }

    const data = await response.json();
    return res.status(200).json({ token: data });

  } catch (error) {
    console.error('Error al obtener el token:', error);
    return res.status(500).json({ error: 'Error interno al procesar la respuesta' });
  }
}