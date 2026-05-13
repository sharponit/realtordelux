import { config } from '../config.js';

const buckets = new Map();

export function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.header('x-forwarded-for') || 'unknown';
  const bucket = buckets.get(key) || { count: 0, resetAt: now + config.rateLimitWindowMs };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + config.rateLimitWindowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  res.setHeader('X-RateLimit-Limit', String(config.rateLimitMax));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(config.rateLimitMax - bucket.count, 0)));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count > config.rateLimitMax) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please retry shortly.'
    });
  }

  return next();
}
