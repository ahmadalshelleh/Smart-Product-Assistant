import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const aiSearchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many search requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  skip: (req: Request) => {
    // Skip rate limiting for cached responses (detected by cache detection middleware)
    return (req as any).cacheHit === true;
  }
});

export const generalApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many API requests, please try again later.'
  }
});
