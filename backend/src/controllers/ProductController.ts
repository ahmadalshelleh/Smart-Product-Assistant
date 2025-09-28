import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { SearchFilters } from '../repositories/IProductRepository';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAllProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const result = await this.productService.getAllProducts(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async searchProducts(req: Request, res: Response) {
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

      const result = await this.productService.searchProducts(query, filters);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.productService.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async getBrands(req: Request, res: Response) {
    try {
      const brands = await this.productService.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch brands' });
    }
  }
}