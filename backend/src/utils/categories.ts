export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'Electronics',
  HOME_KITCHEN: 'Home & Kitchen',
  FASHION: 'Fashion',
  BOOKS_MEDIA: 'Books & Media',
  SPORTS_OUTDOORS: 'Sports & Outdoors',
  BEAUTY_HEALTH: 'Beauty & Health',
  AUTOMOTIVE: 'Automotive',
  TOYS_GAMES: 'Toys & Games'
} as const;

export const CATEGORY_SUBCATEGORIES = {
  [PRODUCT_CATEGORIES.ELECTRONICS]: [
    'Laptops',
    'Smartphones',
    'Headphones',
    'Tablets',
    'Gaming',
    'Audio Equipment'
  ],
  [PRODUCT_CATEGORIES.HOME_KITCHEN]: [
    'Coffee Makers',
    'Appliances',
    'Cookware',
    'Home Decor',
    'Furniture'
  ],
  [PRODUCT_CATEGORIES.FASHION]: [
    'Clothing',
    'Shoes',
    'Accessories',
    'Jewelry',
    'Bags'
  ],
  [PRODUCT_CATEGORIES.BOOKS_MEDIA]: [
    'Programming',
    'Technical',
    'Fiction',
    'Non-Fiction',
    'Educational'
  ],
  [PRODUCT_CATEGORIES.SPORTS_OUTDOORS]: [
    'Fitness',
    'Outdoor Gear',
    'Sports Equipment',
    'Athletic Wear',
    'Camping'
  ],
  [PRODUCT_CATEGORIES.BEAUTY_HEALTH]: [
    'Skincare',
    'Makeup',
    'Hair Care',
    'Health Supplements',
    'Personal Care'
  ],
  [PRODUCT_CATEGORIES.AUTOMOTIVE]: [
    'Car Accessories',
    'Tools',
    'Maintenance',
    'Electronics',
    'Parts'
  ],
  [PRODUCT_CATEGORIES.TOYS_GAMES]: [
    'Board Games',
    'Video Games',
    'Educational Toys',
    'Action Figures',
    'Puzzles'
  ]
};