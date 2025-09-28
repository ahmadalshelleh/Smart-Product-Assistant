import { IProduct } from '../models/Product';

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  brands?: string[];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'name' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findAllWithPagination(page: number, limit: number): Promise<SearchResult>;
  findById(id: string): Promise<IProduct | null>;
  search(criteria: any): Promise<IProduct[]>;
  searchWithFilters(criteria: any, filters: SearchFilters): Promise<SearchResult>;
  create(product: Partial<IProduct>): Promise<IProduct>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
  getCategories(): Promise<string[]>;
  getBrands(): Promise<string[]>;
}