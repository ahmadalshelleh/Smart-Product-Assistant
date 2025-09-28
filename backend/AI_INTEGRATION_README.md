# AI Integration - Smart Product Assistant

This document explains the newly implemented AI integration features for the Smart Product Assistant backend.

## Overview

The AI integration adds intelligent product search capabilities using OpenAI's GPT-4 model to process natural language queries and provide enhanced search results.

## New Features

### 1. AI-Enhanced Search
- Natural language query processing
- Intelligent feature extraction
- Category detection
- Price range inference
- Smart product ranking

### 2. Caching System
- Redis-based caching for AI responses
- Query result caching
- Configurable TTL based on confidence levels

### 3. Rate Limiting
- Protects AI endpoints from abuse
- Configurable limits per IP address
- Different limits for AI vs regular endpoints

## API Endpoints

### AI-Enhanced Search
```
POST /api/search/ai
```

**Request Body:**
```json
{
  "query": "I need a laptop for college work and gaming",
  "category": "Electronics", // optional
  "priceRange": [800, 2000], // optional
  "brands": ["Dell", "HP"], // optional
  "rating": 4.0, // optional
  "page": 1,
  "limit": 12
}
```

**Response:**
```json
{
  "query": "I need a laptop for college work and gaming",
  "processedQuery": {
    "category": "Electronics",
    "features": ["gaming", "portable", "long battery life"],
    "priceRange": [800, 2000],
    "useCase": "college work and gaming",
    "keywords": ["laptop", "gaming", "college", "student"],
    "explanation": "Looking for a versatile laptop suitable for both academic work and gaming",
    "confidence": 0.9
  },
  "explanation": "Found 25 products focusing on Electronics with features like gaming, portable, long battery life in the $800-$2000 range for college work and gaming. Looking for a versatile laptop suitable for both academic work and gaming.",
  "products": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "searchTime": 1250,
  "usedAI": true,
  "fromCache": false
}
```

## Environment Variables

Add these to your `.env` file:

```bash
# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=400
OPENAI_TEMPERATURE=0.1
OPENAI_TIMEOUT=30000
OPENAI_MAX_RETRIES=3

# Cache Configuration
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
CACHE_HIGH_CONFIDENCE_TTL=7200
CACHE_SEARCH_RESULTS_TTL=1800

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine

   # Or install locally
   brew install redis
   redis-server
   ```

3. **Configure OpenAI**
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys)
   - Add it to your `.env` file

4. **Start the Server**
   ```bash
   npm run dev
   ```

## Architecture

### Services
- **OpenAIService**: Handles communication with OpenAI API
- **CachedOpenAIService**: Adds caching layer to OpenAI service
- **EnhancedProductService**: Extends ProductService with AI capabilities
- **CacheService**: Manages Redis caching operations

### Controllers
- **EnhancedProductController**: Handles AI-enhanced search requests

### Middleware
- **rateLimiter**: Implements rate limiting for API endpoints

## Error Handling

The system includes comprehensive error handling:

1. **AI Service Failures**: Falls back to basic search
2. **Cache Failures**: Continues without caching
3. **Rate Limiting**: Returns 429 status with retry information
4. **Invalid Queries**: Returns structured error responses

## Performance Features

1. **Caching**: AI responses and search results are cached
2. **Rate Limiting**: Prevents API abuse
3. **Fallback Mechanisms**: Ensures service availability
4. **Smart Ranking**: AI-powered result relevance scoring

## Monitoring

The system logs various events:
- AI service calls and failures
- Cache hits and misses
- Rate limiting events
- Performance metrics

## Testing

Test the AI search endpoint:

```bash
curl -X POST http://localhost:5000/api/search/ai \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need a gaming laptop under $1500",
    "limit": 5
  }'
```

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits

2. **Redis Connection Issues**
   - Ensure Redis is running
   - Check the REDIS_URL environment variable

3. **Rate Limiting Issues**
   - Check if you're hitting rate limits
   - Adjust RATE_LIMIT_MAX if needed

4. **Build Issues**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all dependencies are installed

### Logs to Check

- OpenAI API call logs
- Redis connection logs
- Rate limiting logs
- Search performance logs

## Future Enhancements

Potential improvements:
- Vector embeddings for semantic search
- User preference learning
- Multi-language support
- Advanced analytics and insights
