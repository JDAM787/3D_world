/**
 * Native in-memory rate limiter middleware (SEC-07).
 * Zero external dependencies.
 */
export function createRateLimiter({ windowMs = 60 * 1000, maxRequests = 30 } = {}) {
  const ipRequests = new Map();

  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipRequests.get(ip);

    if (!record || now > record.resetTime) {
      ipRequests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests from this IP. Please try again later.',
      });
    }

    return next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 30,     // 30 requests per minute
});

export default authRateLimiter;

