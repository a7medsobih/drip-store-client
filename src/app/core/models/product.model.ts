// src/app/core/models
export type ProductSort =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';

export interface CategoryRef {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: CategoryRef;
  subCategoryId: CategoryRef;
  isActive?: boolean;
  isDeleted?: boolean;
  totalSold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  items: Product[];
  pagination: Pagination;
}

export interface ProductQueryParams {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort?: ProductSort;
}

export type IProduct = Product;
