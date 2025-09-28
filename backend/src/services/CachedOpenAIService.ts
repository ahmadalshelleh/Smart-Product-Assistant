import { OpenAIService, ProcessedQuery } from './OpenAIService';
import { CacheService } from './CacheService';

export class CachedOpenAIService extends OpenAIService {
  constructor(private cacheService: CacheService) {
    super();
  }

  async processQuery(userQuery: string): Promise<ProcessedQuery> {
    // Try cache first
    const cached = await this.cacheService.getProcessedQuery(userQuery);
    if (cached) {
      console.log('Using cached query processing result');
      return cached;
    }

    // Process with AI and cache result
    const result = await super.processQuery(userQuery);
    
    // Cache for longer if confidence is high
    const ttl = result.confidence > 0.8 ? 7200 : 3600; // 2 hours vs 1 hour
    await this.cacheService.setProcessedQuery(userQuery, result, ttl);
    
    return result;
  }
}
