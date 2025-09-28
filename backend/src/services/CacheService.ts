import Redis from 'ioredis';
import crypto from 'crypto';

export class CacheService {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async getProcessedQuery(query: string): Promise<any> {
    try {
      const key = this.generateCacheKey('query', query);
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setProcessedQuery(query: string, processedQuery: any, ttl?: number): Promise<void> {
    try {
      const key = this.generateCacheKey('query', query);
      await this.redis.setex(key, ttl || this.defaultTTL, JSON.stringify(processedQuery));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async getSearchResults(searchKey: string): Promise<any> {
    try {
      const key = this.generateCacheKey('search', searchKey);
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setSearchResults(searchKey: string, results: any, ttl?: number): Promise<void> {
    try {
      const key = this.generateCacheKey('search', searchKey);
      await this.redis.setex(key, ttl || this.defaultTTL, JSON.stringify(results));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  private generateCacheKey(type: string, input: string): string {
    const hash = crypto.createHash('md5').update(input.toLowerCase().trim()).digest('hex');
    return `spa:${type}:${hash}`;
  }

  generateSearchKey(query: string, filters: any): string {
    const searchData = { query: query.toLowerCase().trim(), filters };
    const hash = crypto.createHash('md5').update(JSON.stringify(searchData)).digest('hex');
    return hash;
  }
}
