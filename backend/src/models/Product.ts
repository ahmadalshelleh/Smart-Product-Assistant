import mongoose from 'mongoose';

interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  color?: string;
  size?: string;
  brand?: string;
  rating?: number;
  stockQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  color: { type: String },
  size: { type: String },
  brand: { type: String },
  rating: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Text index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text',
  category: 'text'
});

// Compound indexes for filtering
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, rating: -1 });
productSchema.index({ price: 1, rating: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
export type { IProduct };