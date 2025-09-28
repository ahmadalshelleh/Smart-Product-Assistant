import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = process.env.SWAGGER_SERVER_URL || 'http://localhost:5001/api';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Product Assistant API',
    version: '1.0.0',
    description: 'AI-powered product search and recommendation API with advanced filtering and caching capabilities',
    contact: {
      name: 'API Support',
      email: 'support@smartproductassistant.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: serverUrl,
      description: isProduction ? 'Production server' : 'Development server'
    }
  ],
  tags: [
    {
      name: 'Products',
      description: 'Product catalog operations'
    },
    {
      name: 'Search',
      description: 'AI-enhanced product search'
    },
    {
      name: 'Health',
      description: 'API health and status'
    }
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['name', 'price', 'category'],
        properties: {
          _id: {
            type: 'string',
            description: 'Product ID',
            example: '507f1f77bcf86cd799439011'
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Gaming Laptop Pro'
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'High-performance gaming laptop with RTX 4080'
          },
          price: {
            type: 'number',
            description: 'Product price in USD',
            example: 1299.99
          },
          category: {
            type: 'string',
            description: 'Product category',
            example: 'Electronics'
          },
          brand: {
            type: 'string',
            description: 'Product brand',
            example: 'TechBrand'
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Product rating (0-5)',
            example: 4.5
          },
          stockQuantity: {
            type: 'integer',
            minimum: 0,
            description: 'Available stock quantity',
            example: 25
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            description: 'Product image URL',
            example: 'https://example.com/product.jpg'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      PaginatedResponse: {
        type: 'object',
        required: ['products', 'total', 'page', 'totalPages'],
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          },
          total: {
            type: 'integer',
            description: 'Total number of products',
            example: 150
          },
          page: {
            type: 'integer',
            description: 'Current page number',
            example: 1
          },
          totalPages: {
            type: 'integer',
            description: 'Total number of pages',
            example: 13
          }
        }
      },
      ProcessedQuery: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Detected product category',
            example: 'Electronics'
          },
          features: {
            type: 'array',
            items: { type: 'string' },
            description: 'Extracted product features',
            example: ['gaming', 'high-performance', 'RTX']
          },
          priceRange: {
            type: 'array',
            items: { type: 'number' },
            minItems: 2,
            maxItems: 2,
            description: 'Detected price range [min, max]',
            example: [1000, 2000]
          },
          useCase: {
            type: 'string',
            description: 'Detected use case',
            example: 'gaming'
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Extracted keywords',
            example: ['gaming', 'laptop']
          },
          explanation: {
            type: 'string',
            description: 'AI explanation of query processing',
            example: 'Detected search for high-end gaming laptops'
          },
          confidence: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            description: 'AI confidence score',
            example: 0.9
          }
        }
      },
      SearchResponse: {
        type: 'object',
        required: ['query', 'products', 'total', 'page', 'totalPages', 'searchTime', 'usedAI'],
        properties: {
          query: {
            type: 'string',
            description: 'Original search query',
            example: 'gaming laptop under $1500'
          },
          processedQuery: {
            $ref: '#/components/schemas/ProcessedQuery'
          },
          explanation: {
            type: 'string',
            description: 'Search result explanation',
            example: 'Found 25 products matching your gaming laptop search'
          },
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          },
          total: {
            type: 'integer',
            description: 'Total matching products',
            example: 25
          },
          page: {
            type: 'integer',
            description: 'Current page',
            example: 1
          },
          totalPages: {
            type: 'integer',
            description: 'Total pages',
            example: 3
          },
          searchTime: {
            type: 'integer',
            description: 'Search time in milliseconds',
            example: 1250
          },
          usedAI: {
            type: 'boolean',
            description: 'Whether AI was used for processing',
            example: true
          },
          fromCache: {
            type: 'boolean',
            description: 'Whether result was served from cache',
            example: false
          }
        }
      },
      SearchRequest: {
        type: 'object',
        required: ['query'],
        properties: {
          query: {
            type: 'string',
            maxLength: 500,
            description: 'Search query (max 500 characters)',
            example: 'gaming laptop under $1500'
          },
          category: {
            type: 'string',
            description: 'Filter by category',
            example: 'Electronics'
          },
          priceRange: {
            type: 'array',
            items: { type: 'number' },
            minItems: 2,
            maxItems: 2,
            description: 'Price range filter [min, max]',
            example: [500, 1500]
          },
          brands: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by brands',
            example: ['TechBrand', 'GameCorp']
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Minimum rating filter',
            example: 4.0
          },
          sortBy: {
            type: 'string',
            enum: ['price', 'rating', 'name', 'relevance'],
            description: 'Sort field',
            example: 'relevance'
          },
          sortOrder: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Sort order',
            example: 'desc'
          },
          page: {
            type: 'integer',
            minimum: 1,
            description: 'Page number',
            example: 1
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Items per page (1-100)',
            example: 12
          }
        }
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Search query is required'
          },
          statusCode: {
            type: 'integer',
            description: 'HTTP status code',
            example: 400
          }
        }
      },
      HealthResponse: {
        type: 'object',
        required: ['status', 'timestamp', 'service'],
        properties: {
          status: {
            type: 'string',
            description: 'Service status',
            example: 'OK'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Health check timestamp'
          },
          service: {
            type: 'string',
            description: 'Service name',
            example: 'Smart Product Assistant API'
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      TooManyRequests: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: isProduction
    ? [
        './dist/routes/*.js',
        './dist/controllers/*.js',
        './dist/models/*.js'
      ]
    : [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
      ]
};

export const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI options
  const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Smart Product Assistant API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true
    }
  };

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  
  // Serve raw OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};
