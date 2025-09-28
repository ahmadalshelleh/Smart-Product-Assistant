import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import dotenv from 'dotenv';

dotenv.config();

export async function createSearchIndexes() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI!);
    
    console.log('Creating search indexes...');
    
    // Text search index with weights
    await Product.collection.createIndex({
      name: 'text',
      description: 'text',
      brand: 'text',
      category: 'text'
    }, {
      weights: {
        name: 10,
        brand: 5,
        category: 3,
        description: 1
      },
      name: 'text_search_index'
    });
    
    console.log('✓ Text search index created');
    
    // Filtering indexes
    await Product.collection.createIndex({ category: 1, price: 1 });
    console.log('✓ Category-price compound index created');
    
    await Product.collection.createIndex({ brand: 1, rating: -1 });
    console.log('✓ Brand-rating compound index created');
    
    await Product.collection.createIndex({ price: 1, rating: -1 });
    console.log('✓ Price-rating compound index created');
    
    await Product.collection.createIndex({ rating: -1 });
    console.log('✓ Rating index created');
    
    await Product.collection.createIndex({ stockQuantity: 1 });
    console.log('✓ Stock quantity index created');
    
    await Product.collection.createIndex({ createdAt: -1 });
    console.log('✓ Created date index created');
    
    console.log('All search indexes created successfully');
    
    // List all indexes
    const indexes = await Product.collection.listIndexes().toArray();
    console.log('\\nCurrent indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\\nDatabase connection closed');
  }
}

if (require.main === module) {
  createSearchIndexes();
}