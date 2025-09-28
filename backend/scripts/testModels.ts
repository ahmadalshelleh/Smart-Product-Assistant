import { Product, IProduct } from '../src/models/Product';
import { PRODUCT_CATEGORIES } from '../src/utils/categories';
import { DatabaseHelpers } from '../src/utils/databaseHelpers';

// Test that our models and utilities compile correctly
console.log('Testing Product model and utilities...');

// Test interface
const testProduct: IProduct = {
  name: "Test Product",
  description: "This is a test product",
  price: 99.99,
  category: PRODUCT_CATEGORIES.ELECTRONICS,
  brand: "Test Brand",
  rating: 4.5,
  stockQuantity: 10
};

console.log('✓ Product interface works correctly');
console.log('Sample product:', testProduct);

// Test categories
console.log('\\n✓ Product categories available:');
Object.values(PRODUCT_CATEGORIES).forEach(category => {
  console.log(`- ${category}`);
});

// Test that DatabaseHelpers class exists
console.log('\\n✓ DatabaseHelpers class is available');
console.log('Methods available:', Object.getOwnPropertyNames(DatabaseHelpers));

console.log('\\n✅ All models and utilities compiled successfully!');
console.log('\\nNote: To test database operations, make sure MongoDB is running and run:');
console.log('- npm run seed (to populate the database)');
console.log('- npm run create-indexes (to create search indexes)');
console.log('- npm run db:reset (to do both)');