import { Product, IProduct } from '../models/Product';
import { IProductRepository, SearchFilters, SearchResult } from './IProductRepository';

export class ProductRepository implements IProductRepository {
  
  async findAll(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 });
  }

  async findAllWithPagination(page: number = 1, limit: number = 12): Promise<SearchResult> {
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments()
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async search(criteria: any): Promise<IProduct[]> {
    const query: any = {};
    
    if (criteria.category) {
      query.category = new RegExp(criteria.category, 'i');
    }
    
    if (criteria.priceRange) {
      query.price = {
        $gte: criteria.priceRange[0],
        $lte: criteria.priceRange[1]
      };
    }
    
    if (criteria.keywords && criteria.keywords.length > 0) {
      query.$text = { $search: criteria.keywords.join(' ') };
    }
    
    if (criteria.brands && criteria.brands.length > 0) {
      query.brand = { $in: criteria.brands };
    }
    
    return await Product.find(query);
  }

  async searchWithFilters(criteria: any, filters: SearchFilters): Promise<SearchResult> {
    const query: any = {};
    
    // Apply search criteria
    if (criteria.category) {
      query.category = new RegExp(criteria.category, 'i');
    }
    
    if (criteria.keywords && criteria.keywords.length > 0) {
      query.$text = { $search: criteria.keywords.join(' ') };
    }
    
    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.priceRange) {
      query.price = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] };
    }
    
    if (filters.brands?.length) {
      query.brand = { $in: filters.brands };
    }
    
    if (filters.rating) {
      query.rating = { $gte: filters.rating };
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    // Sorting
    let sort: any = {};
    if (filters.sortBy) {
      if (filters.sortBy === 'relevance' && query.$text) {
        sort = { score: { $meta: 'textScore' } };
      } else {
        sort[filters.sortBy] = filters.sortOrder === 'desc' ? -1 : 1;
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Build the query with proper projection for text score sorting
    let productQuery = Product.find(query);
    
    // Add score projection when sorting by text relevance
    // MongoDB requires projecting the textScore when sorting by it for consistent results
    if (filters.sortBy === 'relevance' && query.$text) {
      productQuery = productQuery.select({ score: { $meta: 'textScore' } });
    }
    
    const [products, total] = await Promise.all([
      productQuery.sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async create(product: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(product);
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, product, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  async getCategories(): Promise<string[]> {
    return await Product.distinct('category');
  }

  async getBrands(): Promise<string[]> {
    return await Product.distinct('brand');
  }
}