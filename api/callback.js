const https = require("https");

module.exports = (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Falta el parámetro 'code' en la URL" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = "https://growthloop-oauth.vercel.app/api/callback";

  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  }).toString();

  const options = {
    hostname: "www.tiendanube.com",
    path: "/apps/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      "User-Agent": "GrowthLoop OAuth App (contact@growthloop.com)",
    },
  };

  const request = https.request(options, (response) => {
    let rawData = "";

    response.on("data", (chunk) => {
      rawData += chunk;
    });

    response.on("end", () => {
      try {
        const contentType = response.headers["content-type"] || "";

        if (contentType.includes("application/json")) {
          const parsed = JSON.parse(rawData);
          console.log("✅ Token recibido:", parsed);
          res.status(200).json(parsed);
        } else {
          console.error("❌ Respuesta no es JSON:", rawData);
          res.status(502).json({ error: "Respuesta no válida del servidor de Tiendanube" });
        }
      } catch (err) {
        console.error("❌ Error al parsear respuesta:", err.message);
        console.error("🔍 Cuerpo recibido:", rawData);
        res.status(500).json({ error: "Error interno al procesar la respuesta" });
      }
    });
  });

  request.on("error", (err) => {
    console.error("❌ Error en la solicitud HTTPS:", err.message);
    res.status(500).json({ error: "Error al contactar con Tiendanube" });
  });

  request.write(data);
  request.end();
};