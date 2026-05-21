import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import {
  DEFAULT_LIMIT,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
  PRODUCT_SORT_OPTIONS,
} from '@core/constants/product.constants';
import { ProductSort, Product, ProductQueryParams, Pagination } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';

import { environment } from '../../../../environments/env-development';
import { FilterOption, ViewMode } from './products.types';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly environment = environment;
  protected readonly sortOptions = PRODUCT_SORT_OPTIONS;

  protected readonly products = signal<Product[]>([]);
  protected readonly pagination = signal<Pagination | null>(null);

  protected readonly searchTerm = signal('');
  protected readonly selectedCategoryId = signal('');
  protected readonly minPrice = signal(DEFAULT_MIN_PRICE);
  protected readonly maxPrice = signal(DEFAULT_MAX_PRICE);

  protected readonly page = signal(DEFAULT_PAGE);
  protected readonly limit = signal(DEFAULT_LIMIT);
  protected readonly sort = signal<ProductSort>(DEFAULT_SORT);

  protected readonly loading = signal(false);
  protected readonly viewMode = signal<ViewMode>('grid');

  protected readonly hasMore = computed(() => {
    const pagination = this.pagination();

    return pagination !== null && this.page() < pagination.totalPages;
  });

  protected readonly isDefaultFilters = computed(
    () =>
      this.searchTerm() === '' &&
      this.selectedCategoryId() === '' &&
      this.minPrice() === DEFAULT_MIN_PRICE &&
      this.maxPrice() === DEFAULT_MAX_PRICE &&
      this.sort() === DEFAULT_SORT,
  );

  protected readonly clearFiltersButtonClass = computed(() =>
    this.isDefaultFilters()
      ? 'bg-primary text-on-primary px-md py-xs rounded-full font-label-caps text-label-caps shadow-sm'
      : 'glass-card px-md py-xs rounded-full font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-all',
  );

  protected readonly sortSelectClass =
    'glass-card px-md py-xs rounded-full font-label-caps text-label-caps text-on-surface-variant focus:outline-none';

  protected readonly productsContainerClass = computed(() =>
    this.viewMode() === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg'
      : 'grid grid-cols-1 gap-lg',
  );

  protected readonly categoryOptions = computed<FilterOption[]>(() => {
    const categoriesMap = new Map<string, FilterOption>();

    for (const product of this.products()) {
      categoriesMap.set(product.categoryId._id, {
        label: product.categoryId.name,
        value: product.categoryId._id,
      });
    }

    return Array.from(categoriesMap.values()).sort((firstOption, secondOption) =>
      firstOption.label.localeCompare(secondOption.label),
    );
  });

  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private currentRequestId = 0;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.searchDebounceTimer !== null) {
        clearTimeout(this.searchDebounceTimer);
      }
    });

    this.fetchProducts();
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    this.searchTerm.set(value);
    this.debounceRefetch();
  }

  protected onCategoryChange(categoryId: string): void {
    this.selectedCategoryId.update((currentCategoryId) =>
      currentCategoryId === categoryId ? '' : categoryId,
    );
    this.refetchProducts();
  }

  protected categoryTextClass(categoryId: string): string {
    return this.selectedCategoryId() === categoryId
      ? 'font-body-sm text-body-sm text-primary font-semibold'
      : 'font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary';
  }

  protected onMaxPriceChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    this.maxPrice.set(Number.isFinite(value) ? value : DEFAULT_MAX_PRICE);
    this.refetchProducts();
  }

  protected onSortChange(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value;

    if (!this.isProductSort(sort)) {
      return;
    }

    this.sort.set(sort);
    this.refetchProducts();
  }

  protected loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }

    const currentPage = this.page();
    const nextPage = currentPage + 1;

    this.page.set(nextPage);
    this.fetchProducts({ append: true, fallbackPage: currentPage });
  }

  protected clearFilters(): void {
    if (this.searchDebounceTimer !== null) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }

    this.searchTerm.set('');
    this.selectedCategoryId.set('');
    this.minPrice.set(DEFAULT_MIN_PRICE);
    this.maxPrice.set(DEFAULT_MAX_PRICE);
    this.page.set(DEFAULT_PAGE);
    this.sort.set(DEFAULT_SORT);

    this.fetchProducts();
  }

  private refetchProducts(): void {
    this.page.set(DEFAULT_PAGE);
    this.fetchProducts();
  }

  private debounceRefetch(): void {
    if (this.searchDebounceTimer !== null) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.page.set(DEFAULT_PAGE);
      this.fetchProducts();
    }, 300);
  }

  private fetchProducts(options: { append?: boolean; fallbackPage?: number } = {}): void {
    const requestId = ++this.currentRequestId;

    this.loading.set(true);

    this.productService
      .getProducts(this.buildQueryParams())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (requestId === this.currentRequestId) {
            this.loading.set(false);
          }
        }),
      )
      .subscribe({
        next: (response) => {
          if (requestId !== this.currentRequestId) {
            return;
          }

          this.products.update((currentProducts) =>
            options.append ? [...currentProducts, ...response.items] : response.items,
          );
          this.pagination.set(response.pagination);
        },
        error: () => {
          if (requestId !== this.currentRequestId) {
            return;
          }

          if (options.fallbackPage !== undefined) {
            this.page.set(options.fallbackPage);
          }

          if (!options.append) {
            this.products.set([]);
            this.pagination.set(null);
          }
        },
      });
  }

  private buildQueryParams(): ProductQueryParams {
    const search = this.searchTerm().trim();
    const params: ProductQueryParams = {
      page: this.page(),
      limit: this.limit(),
      sort: this.sort(),
    };

    if (search) {
      params.search = search;
    }

    if (this.selectedCategoryId()) {
      params.categoryId = this.selectedCategoryId();
    }

    if (this.minPrice() > DEFAULT_MIN_PRICE) {
      params.minPrice = this.minPrice();
    }

    if (this.maxPrice() < DEFAULT_MAX_PRICE) {
      params.maxPrice = this.maxPrice();
    }

    return params;
  }

  private isProductSort(value: string): value is ProductSort {
    return PRODUCT_SORT_OPTIONS.some((option) => option.value === value);
  }
}


