import { Product } from '../models/Product';

export class DatabaseHelpers {
  
  static async getCategories(): Promise<string[]> {
    return await Product.distinct('category');
  }
  
  static async getBrands(): Promise<string[]> {
    return await Product.distinct('brand');
  }
  
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    return {
      min: result[0]?.minPrice || 0,
      max: result[0]?.maxPrice || 1000
    };
  }
  
  static async getProductStats() {
    const [categories, brands, priceRange, totalCount] = await Promise.all([
      this.getCategories(),
      this.getBrands(),
      this.getPriceRange(),
      Product.countDocuments()
    ]);
    
    return {
      categories,
      brands,
      priceRange,
      totalCount
    };
  }
}