import { config } from '../config.js';

export function requireApiKey(req, res, next) {
  if (!config.apiKey) {
    return res.status(503).json({
      error: 'AI service API key is not configured.'
    });
  }

  const suppliedKey = req.header('x-api-key');

  if (!suppliedKey || suppliedKey !== config.apiKey) {
    return res.status(401).json({
      error: 'Invalid or missing x-api-key header.'
    });
  }

  return next();
}
