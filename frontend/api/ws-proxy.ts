export default function handler(req, res) {
  res.status(501).json({
    error: 'WebSocket proxy is not supported on Vercel.',
    message: 'The current Vertex AI WebSocket proxy cannot run as a Vercel function.',
  });
}
