import { Request, Response } from 'express';
import { EnhancedProductService } from '../services/EnhancedProductService';
import { SearchFilters } from '../repositories/IProductRepository';
import { CacheService } from '../services/CacheService';

export class EnhancedProductController {
  constructor(
    private productService: EnhancedProductService,
    private cacheService: CacheService
  ) {}

  async searchProductsWithAI(req: Request, res: Response) {
    try {
      const { query } = req.body;
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

      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // Check cache first
      const searchKey = this.cacheService.generateSearchKey(query, filters);
      const cached = await this.cacheService.getSearchResults(searchKey);
      
      if (cached) {
        res.set('x-cache', 'hit');
        return res.json({ ...cached, fromCache: true });
      }

      // Perform AI-enhanced search
      const result = await this.productService.searchProductsWithAI(query, filters);
      
      // Cache results
      await this.cacheService.setSearchResults(searchKey, result, 1800); // 30 minutes
      
      res.set('x-cache', 'miss');
      res.json({ ...result, fromCache: false });
    } catch (error) {
      console.error('AI search error:', error);
      res.status(500).json({ 
        error: 'Search failed',
        fallback: 'Please try a simpler search query'
      });
    }
  }
}
