import { Router } from 'express';
import productRoutes from './productRoutes';
import aiRoutes from './aiRoutes';
import { generalApiRateLimit } from '../middleware/rateLimiter';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalApiRateLimit);

router.use('/', productRoutes);
router.use('/', aiRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Smart Product Assistant API'
  });
});

export default router;