import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/CacheService';
import { SearchFilters } from '../repositories/IProductRepository';

// Extend Request interface to include cache hit flag
declare global {
  namespace Express {
    interface Request {
      cacheHit?: boolean;
    }
  }
}

/**
 * Middleware to detect cache hits before rate limiting
 * This allows cached responses to bypass rate limits
 */
export const createCacheDetectionMiddleware = (cacheService: CacheService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only check cache for search endpoints
      if (req.method === 'POST' && (req.path === '/search' || req.path === '/search/ai')) {
        const { query } = req.body;
        
        if (query && typeof query === 'string') {
          // Extract filters from request body (same logic as controller)
          const filters: SearchFilters = {
            category: req.body.category,
            priceRange: req.body.priceRange,
            brands: req.body.brands,
            rating: req.body.rating,
            sortBy: req.body.sortBy,
            sortOrder: req.body.sortOrder,
            page: req.body.page || 1,
            limit: req.body.limit || 12
          };

          // Check if this search is cached
          const searchKey = cacheService.generateSearchKey(query, filters);
          const cached = await cacheService.getSearchResults(searchKey);
          
          if (cached) {
            // Mark this request as a cache hit
            req.cacheHit = true;
            console.log(`Cache hit detected for search: "${query}" - bypassing rate limit`);
          }
        }
      }
    } catch (error) {
      // Don't fail the request if cache detection fails
      console.warn('Cache detection middleware error:', error);
    }
    
    next();
  };
};
