const PROXY_HEADER = process.env.PROXY_HEADER ?? '_leOsbhD38BREWxkRoC9KbA01aN_il0F';
const ALLOWED_HOSTNAMES = new Set([
  'aiplatform.googleapis.com',
  'aiplatform.clients6.google.com',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (req.headers['x-app-proxy'] !== PROXY_HEADER) {
    return res.status(403).json({ error: 'Forbidden: Invalid proxy header.' });
  }

  const { originalUrl, method = 'POST', headers = {}, body } = req.body ?? {};
  if (!originalUrl || typeof originalUrl !== 'string') {
    return res.status(400).json({ error: 'Bad Request: originalUrl is required.' });
  }

  let url;
  try {
    url = new URL(originalUrl);
  } catch (error) {
    return res.status(400).json({ error: 'Bad Request: originalUrl is invalid.' });
  }

  if (!ALLOWED_HOSTNAMES.has(url.hostname.toLowerCase())) {
    return res.status(400).json({ error: 'Bad Request: Invalid target hostname.' });
  }

  const forwardedHeaders = Object.entries(headers)
    .filter(([key]) => !['host', 'content-length', 'x-app-proxy'].includes(key.toLowerCase()))
    .reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        acc[key] = value;
      }
      return acc;
    }, {});

  const proxyBody = body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body);

  const response = await fetch(originalUrl, {
    method,
    headers: forwardedHeaders,
    body: proxyBody,
  });

  const responseBytes = await response.arrayBuffer();

  if (response.headers.has('content-type')) {
    res.setHeader('Content-Type', response.headers.get('content-type'));
  }
  if (response.headers.has('cache-control')) {
    res.setHeader('Cache-Control', response.headers.get('cache-control'));
  }

  return res.status(response.status).send(Buffer.from(responseBytes));
}
