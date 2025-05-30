module.exports = (req, res) => {
  const { CLIENT_ID, REDIRECT_URI } = process.env;
  const SCOPES = 'read_products read_orders read_customers';

  const authUrl = `https://www.tiendanube.com/apps/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;

  res.writeHead(302, { Location: authUrl });
  res.end();
};