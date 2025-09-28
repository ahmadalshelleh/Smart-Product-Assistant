import { Router } from 'express';
import { EnhancedProductController } from '../controllers/EnhancedProductController';
import { EnhancedProductService } from '../services/EnhancedProductService';
import { CachedOpenAIService } from '../services/CachedOpenAIService';
import { CacheService } from '../services/CacheService';
import { ProductRepository } from '../repositories/ProductRepository';
import { aiSearchRateLimit } from '../middleware/rateLimiter';
import { validateSearchRequest, validatePaginationParams } from '../middleware/validation';
import { createCacheDetectionMiddleware } from '../middleware/cacheDetection';

const router = Router();

// Initialize services
const productRepository = new ProductRepository();
const cacheService = new CacheService();
const openAIService = new CachedOpenAIService(cacheService);
const enhancedProductService = new EnhancedProductService(productRepository, openAIService);
const enhancedProductController = new EnhancedProductController(enhancedProductService, cacheService);

// Create cache detection middleware
const cacheDetection = createCacheDetectionMiddleware(cacheService);

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: AI-enhanced product search
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchRequest'
 *     responses:
 *       200:
 *         description: Search results
 *         headers:
 *           x-cache:
 *             description: Cache status (hit/miss)
 *             schema:
 *               type: string
 *               enum: [hit, miss]
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/search', 
  validateSearchRequest, 
  validatePaginationParams, 
  cacheDetection,
  aiSearchRateLimit, 
  (req, res) => enhancedProductController.searchProductsWithAI(req, res)
);

/**
 * @swagger
 * /api/search/ai:
 *   post:
 *     summary: AI-enhanced product search (alternative endpoint)
 *     tags: [Search]
 *     description: Alternative endpoint for AI-enhanced search (for backwards compatibility)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchRequest'
 *     responses:
 *       200:
 *         description: Search results
 *         headers:
 *           x-cache:
 *             description: Cache status (hit/miss)
 *             schema:
 *               type: string
 *               enum: [hit, miss]
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/search/ai', 
  validateSearchRequest, 
  validatePaginationParams, 
  cacheDetection,
  aiSearchRateLimit, 
  (req, res) => enhancedProductController.searchProductsWithAI(req, res)
);

export default router;
