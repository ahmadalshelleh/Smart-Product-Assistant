# Database Setup Guide

## Overview

This backend uses MongoDB with Mongoose for data persistence. The database includes product data with full-text search capabilities and optimized indexes.

## Quick Start

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file with your MongoDB URI (default: mongodb://localhost:27017/smart_products)
   ```

3. **Initialize database**:
   ```bash
   # Seed with sample data and create indexes
   npm run db:reset
   
   # Or run individually:
   npm run seed           # Add sample products
   npm run create-indexes # Create search indexes
   ```

## Database Schema

### Product Model

```typescript
interface IProduct {
  name: string;           // Product name
  description: string;    // Product description
  price: number;         // Price in dollars
  category: string;      // Product category
  imageUrl?: string;     // Product image URL
  color?: string;        // Product color
  size?: string;         // Product size
  brand?: string;        // Product brand
  rating?: number;       // Rating (0-5)
  stockQuantity?: number; // Available stock
  createdAt?: Date;      // Auto-generated
  updatedAt?: Date;      // Auto-generated
}
```

## Search Indexes

The database includes optimized indexes for:

- **Text Search**: Full-text search across name, description, brand, and category
- **Filtering**: Compound indexes for category/price, brand/rating combinations
- **Sorting**: Indexes for rating, price, and creation date

## Sample Data

The seed script includes ~20 sample products across categories:
- Electronics (laptops, phones, headphones)
- Home & Kitchen (appliances, cookware)
- Fashion (clothing, shoes, accessories)
- Books & Media
- Sports & Outdoors
- Beauty & Health

## Available Scripts

- `npm run seed` - Populate database with sample data
- `npm run create-indexes` - Create search optimization indexes
- `npm run db:reset` - Clear database, seed data, and create indexes
- `npx ts-node scripts/testModels.ts` - Test model compilation

## Database Operations

### Using DatabaseHelpers

```typescript
import { DatabaseHelpers } from './src/utils/databaseHelpers';

// Get all categories
const categories = await DatabaseHelpers.getCategories();

// Get all brands
const brands = await DatabaseHelpers.getBrands();

// Get price range
const priceRange = await DatabaseHelpers.getPriceRange();

// Get comprehensive stats
const stats = await DatabaseHelpers.getProductStats();
```

### Direct Product Operations

```typescript
import { Product } from './src/models/Product';

// Find products by category
const electronics = await Product.find({ category: 'Electronics' });

// Text search
const searchResults = await Product.find({ $text: { $search: 'laptop gaming' } });

// Price range filter
const budgetProducts = await Product.find({ 
  price: { $gte: 50, $lte: 200 } 
});
```

## Troubleshooting

1. **Connection Issues**: Ensure MongoDB is running (`brew services start mongodb/brew/mongodb-community`)
2. **Seeding Errors**: Check MongoDB URI in `.env` file
3. **Index Errors**: Drop existing indexes if schema changes: `db.products.dropIndexes()`

## Next Steps

After database setup:
1. Implement repository layer (03-Backend-Core.md)
2. Create API endpoints for product search
3. Add AI-powered search capabilities (04-AI-Integration.md)