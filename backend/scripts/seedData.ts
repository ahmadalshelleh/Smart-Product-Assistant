import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  // Electronics
  {
    name: "MacBook Air M2",
    description: "Lightweight laptop perfect for students and professionals. 13-inch display, all-day battery life, perfect for college work and creative projects.",
    price: 1199.00,
    category: "Electronics",
    imageUrl: "https://example.com/macbook-air.jpg",
    brand: "Apple",
    rating: 4.8,
    stockQuantity: 50
  },
  {
    name: "Sony WH-1000XM4 Headphones",
    description: "Industry-leading noise canceling headphones. Perfect for work, travel, and music listening. 30-hour battery life.",
    price: 349.99,
    category: "Electronics",
    imageUrl: "https://example.com/sony-headphones.jpg",
    brand: "Sony",
    rating: 4.7,
    stockQuantity: 75
  },
  {
    name: "Gaming Desktop PC",
    description: "High-performance gaming computer with RTX 4070, perfect for gaming and content creation.",
    price: 1499.99,
    category: "Electronics",
    imageUrl: "https://example.com/gaming-pc.jpg",
    brand: "Custom Build",
    rating: 4.6,
    stockQuantity: 15
  },
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with titanium design, advanced camera system, and A17 Pro chip. Perfect for photography and professional work.",
    price: 999.00,
    category: "Electronics",
    imageUrl: "https://example.com/iphone-15-pro.jpg",
    brand: "Apple",
    rating: 4.6,
    stockQuantity: 30,
    color: "Natural Titanium",
    size: "6.1-inch"
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-portable laptop with stunning InfinityEdge display. Great for business and creative work.",
    price: 899.99,
    category: "Electronics",
    imageUrl: "https://example.com/dell-xps-13.jpg",
    brand: "Dell",
    rating: 4.5,
    stockQuantity: 40,
    color: "Platinum Silver",
    size: "13.4-inch"
  },
  {
    name: "Wireless Bluetooth Speaker",
    description: "Portable speaker with excellent sound quality. Perfect for outdoor activities and home use.",
    price: 79.99,
    category: "Electronics",
    imageUrl: "https://example.com/bluetooth-speaker.jpg",
    brand: "JBL",
    rating: 4.2,
    stockQuantity: 90
  },
  
  // Home & Kitchen
  {
    name: "Breville Barista Express",
    description: "Professional-grade espresso machine for coffee enthusiasts. Built-in grinder, steam wand, perfect for making cafe-quality drinks at home.",
    price: 699.00,
    category: "Home & Kitchen",
    imageUrl: "https://example.com/breville-espresso.jpg",
    brand: "Breville",
    rating: 4.6,
    stockQuantity: 25
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-qt stand mixer with 10 speeds. Perfect for baking, mixing, and food preparation.",
    price: 379.99,
    category: "Home & Kitchen",
    imageUrl: "https://example.com/kitchenaid-mixer.jpg",
    brand: "KitchenAid",
    rating: 4.8,
    stockQuantity: 35,
    color: "Empire Red"
  },
  {
    name: "Instant Pot Duo",
    description: "7-in-1 pressure cooker that replaces multiple kitchen appliances. Perfect for quick, healthy meals.",
    price: 89.99,
    category: "Home & Kitchen",
    imageUrl: "https://example.com/instant-pot.jpg",
    brand: "Instant Pot",
    rating: 4.5,
    stockQuantity: 120
  },
  {
    name: "Ninja Foodi Air Fryer",
    description: "Multi-functional air fryer that pressure cooks, air fries, and more. Perfect for healthy cooking.",
    price: 199.99,
    category: "Home & Kitchen",
    imageUrl: "https://example.com/ninja-foodi.jpg",
    brand: "Ninja",
    rating: 4.4,
    stockQuantity: 60
  },
  
  // Fashion
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans. Timeless style, durable denim, perfect for everyday wear.",
    price: 89.50,
    category: "Fashion",
    imageUrl: "https://example.com/levis-jeans.jpg",
    brand: "Levi's",
    rating: 4.3,
    stockQuantity: 100,
    color: "Medium Wash",
    size: "32x32"
  },
  {
    name: "Nike Air Max 90",
    description: "Iconic sneakers with visible Air cushioning. Perfect for casual wear and light exercise.",
    price: 120.00,
    category: "Fashion",
    imageUrl: "https://example.com/nike-air-max.jpg",
    brand: "Nike",
    rating: 4.5,
    stockQuantity: 80,
    color: "White/Black",
    size: "US 10"
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Classic aviator sunglasses with UV protection. Timeless style for any occasion.",
    price: 154.00,
    category: "Fashion",
    imageUrl: "https://example.com/rayban-aviator.jpg",
    brand: "Ray-Ban",
    rating: 4.7,
    stockQuantity: 45,
    color: "Gold Frame"
  },
  {
    name: "Adidas Running Shoes",
    description: "Lightweight running shoes with Boost technology. Perfect for jogging and daily exercise.",
    price: 130.00,
    category: "Fashion",
    imageUrl: "https://example.com/adidas-running.jpg",
    brand: "Adidas",
    rating: 4.4,
    stockQuantity: 65,
    color: "Black/White",
    size: "US 9"
  },
  
  // Books & Media
  {
    name: "The Psychology of Programming",
    description: "Essential book for software developers. Insights into human factors in programming.",
    price: 29.99,
    category: "Books & Media",
    imageUrl: "https://example.com/psychology-programming.jpg",
    brand: "Dorset House",
    rating: 4.4,
    stockQuantity: 200
  },
  {
    name: "Clean Code: A Handbook",
    description: "A must-read for any developer. Learn to write clean, maintainable code.",
    price: 35.99,
    category: "Books & Media",
    imageUrl: "https://example.com/clean-code.jpg",
    brand: "Prentice Hall",
    rating: 4.6,
    stockQuantity: 150
  },
  
  // Sports & Outdoors
  {
    name: "Yoga Mat Premium",
    description: "High-quality yoga mat with excellent grip and cushioning. Perfect for home workouts.",
    price: 45.99,
    category: "Sports & Outdoors",
    imageUrl: "https://example.com/yoga-mat.jpg",
    brand: "Gaiam",
    rating: 4.3,
    stockQuantity: 85
  },
  {
    name: "Camping Tent 4-Person",
    description: "Waterproof camping tent that sleeps 4 people. Easy setup for outdoor adventures.",
    price: 199.99,
    category: "Sports & Outdoors",
    imageUrl: "https://example.com/camping-tent.jpg",
    brand: "Coleman",
    rating: 4.2,
    stockQuantity: 30
  },
  
  // Beauty & Health
  {
    name: "Vitamin D3 Supplements",
    description: "High-quality vitamin D3 supplements for immune support and bone health.",
    price: 19.99,
    category: "Beauty & Health",
    imageUrl: "https://example.com/vitamin-d3.jpg",
    brand: "Nature Made",
    rating: 4.5,
    stockQuantity: 300
  },
  {
    name: "Electric Toothbrush",
    description: "Advanced electric toothbrush with multiple cleaning modes and long battery life.",
    price: 89.99,
    category: "Beauty & Health",
    imageUrl: "https://example.com/electric-toothbrush.jpg",
    brand: "Oral-B",
    rating: 4.4,
    stockQuantity: 55
  }
];

export async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI!);
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    console.log(`Successfully seeded ${insertedProducts.length} products`);
    
    // Log some statistics
    const categories = await Product.distinct('category');
    console.log('Categories created:', categories);
    
    const brands = await Product.distinct('brand');
    console.log('Brands created:', brands);
    
    // Log price range
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    
    if (priceStats.length > 0) {
      console.log('Price range:', {
        min: priceStats[0].minPrice,
        max: priceStats[0].maxPrice,
        avg: Math.round(priceStats[0].avgPrice * 100) / 100
      });
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}