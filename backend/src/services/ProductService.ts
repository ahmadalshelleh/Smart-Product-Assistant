import { IProductRepository, SearchFilters, SearchResult } from '../repositories/IProductRepository';
import { IProduct } from '../models/Product';

export interface ProductScore {
  product: IProduct;
  relevanceScore: number;
  explanation: string;
}

export class ProductService {
  constructor(
    protected productRepository: IProductRepository
  ) {}

  async getAllProducts(page: number = 1, limit: number = 12): Promise<SearchResult> {
    return await this.productRepository.findAllWithPagination(page, limit);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await this.productRepository.findById(id);
  }

  async searchProducts(query: string, filters?: SearchFilters) {
    try {
      const keywords = this.extractKeywords(query);
      const basicCriteria = { keywords };
      
      const result = await this.productRepository.searchWithFilters(basicCriteria, filters || {});
      
      return {
        query,
        explanation: `Found ${result.products.length} products matching "${query}"`,
        ...result
      };
    } catch (error) {
      throw new Error('Search failed');
    }
  }

  async getCategories(): Promise<string[]> {
    return await this.productRepository.getCategories();
  }

  async getBrands(): Promise<string[]> {
    return await this.productRepository.getBrands();
  }

  private extractKeywords(query: string): string[] {
    const stopWords = ['i', 'need', 'want', 'looking', 'for', 'a', 'an', 'the', 'is', 'are', 'and', 'or'];
    return query
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  rankProducts(products: IProduct[], searchCriteria: any): ProductScore[] {
    return products.map(product => {
      let score = 0;
      let explanation = [];

      if (product.category.toLowerCase() === searchCriteria.category?.toLowerCase()) {
        score += 0.4;
        explanation.push('Category match');
      }

      if (searchCriteria.priceRange) {
        const [min, max] = searchCriteria.priceRange;
        if (product.price >= min && product.price <= max) {
          score += 0.3;
          explanation.push('Within price range');
        }
      }

      if (searchCriteria.features) {
        const descriptionLower = product.description.toLowerCase();
        const featureMatches = searchCriteria.features.filter(
          (feature: string) => descriptionLower.includes(feature.toLowerCase())
        );
        score += (featureMatches.length / searchCriteria.features.length) * 0.3;
        if (featureMatches.length > 0) {
          explanation.push(`Matches features: ${featureMatches.join(', ')}`);
        }
      }

      return {
        product,
        relevanceScore: score,
        explanation: explanation.join('; ') || 'Basic match'
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}