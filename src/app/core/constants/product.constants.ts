import { ProductSort } from '@core/models/product.model';

export interface ProductSortOption {
  label: string;
  value: ProductSort;
}

export const DEFAULT_MIN_PRICE = 0;
export const DEFAULT_MAX_PRICE = 50000;
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT: ProductSort = 'newest';

export const PRODUCT_SORT_OPTIONS: ReadonlyArray<ProductSortOption> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
  { label: 'Name: Z to A', value: 'name_desc' },
];
