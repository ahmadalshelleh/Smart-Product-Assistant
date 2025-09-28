export const AI_CONFIG = {
  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '400'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.1'),
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
    baseDelay: parseInt(process.env.OPENAI_BASE_DELAY || '1000')
  },
  cache: {
    defaultTTL: parseInt(process.env.CACHE_TTL || '3600'),
    highConfidenceTTL: parseInt(process.env.CACHE_HIGH_CONFIDENCE_TTL || '7200'),
    searchResultsTTL: parseInt(process.env.CACHE_SEARCH_RESULTS_TTL || '1800')
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100')
  }
};
