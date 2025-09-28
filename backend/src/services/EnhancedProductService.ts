import { ProductService } from './ProductService';
import { OpenAIService, ProcessedQuery } from './OpenAIService';
import { IProductRepository, SearchFilters } from '../repositories/IProductRepository';
import { IProduct } from '../models/Product';

export interface EnhancedSearchResult {
  query: string;
  processedQuery: ProcessedQuery;
  explanation: string;
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  searchTime: number;
  usedAI: boolean;
}

export class EnhancedProductService extends ProductService {
  constructor(
    productRepository: IProductRepository,
    private openAIService: OpenAIService
  ) {
    super(productRepository);
  }

  async searchProductsWithAI(query: string, filters?: SearchFilters): Promise<EnhancedSearchResult> {
    const startTime = Date.now();
    let usedAI = false;
    let processedQuery: ProcessedQuery;

    try {
      // Process query with AI
      processedQuery = await this.openAIService.processQuery(query);
      usedAI = true;
      
      // Build search criteria from AI response
      const searchCriteria = this.buildSearchCriteria(processedQuery);
      
      // Merge with user filters
      const mergedFilters = this.mergeFilters(processedQuery, filters);
      
      // Search products
      const result = await this.productRepository.searchWithFilters(searchCriteria, mergedFilters);
      
      // Rank results based on AI insights
      const rankedProducts = this.rankProductsWithAI(result.products, processedQuery);
      
      const searchTime = Date.now() - startTime;
      
      return {
        query,
        processedQuery,
        explanation: this.buildExplanation(processedQuery, result.total),
        products: rankedProducts,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        searchTime,
        usedAI
      };
      
    } catch (error) {
      console.warn('AI search failed, falling back to basic search:', error);
      
      // Fallback to basic search
      const basicResult = await this.searchProducts(query, filters);
      const searchTime = Date.now() - startTime;
      
      return {
        ...basicResult,
        processedQuery: {
          features: [],
          keywords: query.toLowerCase().split(' '),
          explanation: 'Used basic search due to AI service unavailability',
          confidence: 0.3
        },
        searchTime,
        usedAI: false
      };
    }
  }

  private buildSearchCriteria(processedQuery: ProcessedQuery): any {
    const criteria: any = {};
    
    if (processedQuery.category) {
      criteria.category = processedQuery.category;
    }
    
    if (processedQuery.keywords.length > 0) {
      criteria.keywords = processedQuery.keywords;
    }
    
    if (processedQuery.features.length > 0) {
      // Combine features with keywords for broader search
      criteria.keywords = [...(criteria.keywords || []), ...processedQuery.features];
    }
    
    return criteria;
  }

  private mergeFilters(processedQuery: ProcessedQuery, userFilters?: SearchFilters): SearchFilters {
    const merged: SearchFilters = { ...userFilters };
    
    // Use AI price range if user didn't specify one
    if (!merged.priceRange && processedQuery.priceRange) {
      merged.priceRange = processedQuery.priceRange;
    }
    
    // Use AI category if user didn't specify one
    if (!merged.category && processedQuery.category) {
      merged.category = processedQuery.category;
    }
    
    return merged;
  }

  private rankProductsWithAI(products: IProduct[], processedQuery: ProcessedQuery): IProduct[] {
    return products
      .map(product => ({
        product,
        score: this.calculateAIScore(product, processedQuery)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  }

  private calculateAIScore(product: IProduct, processedQuery: ProcessedQuery): number {
    let score = 0;
    
    // Category exact match
    if (processedQuery.category && product.category === processedQuery.category) {
      score += 0.3;
    }
    
    // Feature matches in description
    const descriptionLower = product.description.toLowerCase();
    const nameAndBrandLower = `${product.name} ${product.brand || ''}`.toLowerCase();
    
    processedQuery.features.forEach(feature => {
      const featureLower = feature.toLowerCase();
      if (nameAndBrandLower.includes(featureLower)) {
        score += 0.2;
      } else if (descriptionLower.includes(featureLower)) {
        score += 0.1;
      }
    });
    
    // Price range match
    if (processedQuery.priceRange) {
      const [min, max] = processedQuery.priceRange;
      if (product.price >= min && product.price <= max) {
        score += 0.2;
      } else {
        // Penalty for being outside range
        const distance = Math.min(
          Math.abs(product.price - min),
          Math.abs(product.price - max)
        );
        const maxPrice = Math.max(min, max);
        score -= (distance / maxPrice) * 0.1;
      }
    }
    
    // Rating boost
    if (product.rating && product.rating >= 4.0) {
      score += 0.1;
    }
    
    // Stock availability
    if (product.stockQuantity && product.stockQuantity > 0) {
      score += 0.05;
    }
    
    return Math.max(0, score);
  }

  private buildExplanation(processedQuery: ProcessedQuery, totalResults: number): string {
    const parts = [];
    
    if (processedQuery.category) {
      parts.push(`focusing on ${processedQuery.category}`);
    }
    
    if (processedQuery.features.length > 0) {
      parts.push(`with features like ${processedQuery.features.slice(0, 3).join(', ')}`);
    }
    
    if (processedQuery.priceRange) {
      parts.push(`in the $${processedQuery.priceRange[0]}-$${processedQuery.priceRange[1]} range`);
    }
    
    if (processedQuery.useCase) {
      parts.push(`for ${processedQuery.useCase}`);
    }
    
    const explanation = parts.length > 0 
      ? `Found ${totalResults} products ${parts.join(', ')}`
      : `Found ${totalResults} products matching your search`;
    
    return `${explanation}. ${processedQuery.explanation}`;
  }
}
