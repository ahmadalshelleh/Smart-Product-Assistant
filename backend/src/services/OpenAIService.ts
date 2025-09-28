import OpenAI from 'openai';
import { AI_CONFIG } from '../config/aiConfig';

export interface ProcessedQuery {
  category?: string;
  features: string[];
  priceRange?: [number, number];
  useCase?: string;
  keywords: string[];
  explanation: string;
  confidence: number;
}

export class OpenAIService {
  private openai: OpenAI;
  private maxRetries: number;
  private baseDelay: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: AI_CONFIG.openai.timeout
    });
    this.maxRetries = AI_CONFIG.openai.maxRetries;
    this.baseDelay = AI_CONFIG.openai.baseDelay;
  }

  async processQuery(userQuery: string): Promise<ProcessedQuery> {
    return await this.withRetry(async () => {
      const prompt = this.buildPrompt(userQuery);
      
      const response = await this.openai.chat.completions.create({
        model: AI_CONFIG.openai.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.openai.maxTokens,
        temperature: AI_CONFIG.openai.temperature,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      try {
        const parsed = JSON.parse(content);
        return this.validateAndCleanResponse(parsed, userQuery);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        return this.getFallbackResponse(userQuery);
      }
    });
  }

  private buildPrompt(userQuery: string): string {
    return `
    You are an expert e-commerce product search assistant. Analyze the following user query and extract structured search criteria.

    User Query: "${userQuery}"

    Extract and return ONLY a valid JSON object with these exact fields:
    {
      "category": "one of: Electronics, Home & Kitchen, Fashion, Books & Media, Sports & Outdoors, Beauty & Health, Automotive, Toys & Games, or null if unclear",
      "features": ["array", "of", "key", "product", "features", "or", "specifications"],
      "priceRange": [minPrice, maxPrice] or null if not specified,
      "useCase": "intended use case or purpose",
      "keywords": ["relevant", "search", "keywords"],
      "explanation": "brief explanation of why these criteria match the query",
      "confidence": 0.85
    }

    Guidelines:
    - Extract specific product features mentioned (e.g., "gaming", "noise-canceling", "waterproof")
    - Infer reasonable price ranges based on product type and context
    - Include relevant synonyms in keywords
    - Set confidence between 0.1-1.0 based on query clarity
    - Use null for fields that cannot be determined

    Examples:
    Query: "I need a laptop for college work and gaming"
    Response: {
      "category": "Electronics",
      "features": ["gaming", "portable", "long battery life", "performance"],
      "priceRange": [800, 2000],
      "useCase": "college work and gaming",
      "keywords": ["laptop", "gaming", "college", "student", "portable"],
      "explanation": "Looking for a versatile laptop suitable for both academic work and gaming",
      "confidence": 0.9
    }

    Return only the JSON object, no additional text.
    `;
  }

  private validateAndCleanResponse(parsed: any, originalQuery: string): ProcessedQuery {
    const result: ProcessedQuery = {
      category: this.validateCategory(parsed.category),
      features: Array.isArray(parsed.features) ? parsed.features.filter((f: any) => typeof f === 'string') : [],
      priceRange: this.validatePriceRange(parsed.priceRange),
      useCase: typeof parsed.useCase === 'string' ? parsed.useCase : '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.filter((k: any) => typeof k === 'string') : [],
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'AI-processed search query',
      confidence: typeof parsed.confidence === 'number' ? Math.max(0.1, Math.min(1.0, parsed.confidence)) : 0.5
    };

    // Ensure we have at least some keywords
    if (result.keywords.length === 0) {
      result.keywords = this.extractBasicKeywords(originalQuery);
    }

    return result;
  }

  private validateCategory(category: any): string | undefined {
    const validCategories = [
      'Electronics', 'Home & Kitchen', 'Fashion', 'Books & Media', 
      'Sports & Outdoors', 'Beauty & Health', 'Automotive', 'Toys & Games'
    ];
    
    return typeof category === 'string' && validCategories.includes(category) ? category : undefined;
  }

  private validatePriceRange(priceRange: any): [number, number] | undefined {
    if (Array.isArray(priceRange) && 
        priceRange.length === 2 && 
        typeof priceRange[0] === 'number' && 
        typeof priceRange[1] === 'number' &&
        priceRange[0] >= 0 && 
        priceRange[1] > priceRange[0] &&
        priceRange[1] <= 50000) {
      return [priceRange[0], priceRange[1]];
    }
    return undefined;
  }

  private extractBasicKeywords(query: string): string[] {
    const stopWords = ['i', 'need', 'want', 'looking', 'for', 'a', 'an', 'the', 'is', 'are', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'with'];
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  private getFallbackResponse(userQuery: string): ProcessedQuery {
    return {
      features: [],
      keywords: this.extractBasicKeywords(userQuery),
      explanation: 'Using basic keyword search as fallback',
      confidence: 0.3
    };
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain error types
        if (this.isNonRetryableError(error)) {
          throw lastError;
        }
        
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        console.warn(`OpenAI request failed (attempt ${attempt}/${this.maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  private isNonRetryableError(error: any): boolean {
    // Don't retry on authentication or quota exceeded errors
    return error?.status === 401 || error?.status === 403 || error?.status === 429;
  }
}
