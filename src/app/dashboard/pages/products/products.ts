import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryRef, Product } from '@core/models/product.model';
import {
  DashboardFormSkeleton,
  DashboardPageHeader,
  DashboardTable,
  DashboardTableSkeleton,
} from '@dashboard/components';
import { DashboardBadge } from '@dashboard/components/dashboard-badge/dashboard-badge';
import { DashboardTableColumn } from '@dashboard/models/dashboard.models';
import { CategoriesService } from '@dashboard/services/categories.service';
import { ProductsService } from '@dashboard/services/products.service';
import { environment } from '../../../../environments/env-development';

interface ProductFormState {
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  categoryId: string;
  subCategoryId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardBadge,
    DashboardFormSkeleton,
    DashboardPageHeader,
    DashboardTable,
    DashboardTableSkeleton,
    FormsModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly baseUrl = environment.baseURL;

  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<{ id: string; name: string }[]>([]);
  protected readonly formSubcategories = signal<{ id: string; name: string }[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingSubcategories = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly totalItems = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly error = signal<string | null>(null);
  protected readonly toast = signal<string | null>(null);
  protected readonly showForm = signal(false);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly imageFile = signal<File | null>(null);
  protected readonly imagePreview = signal('');
  protected readonly submitting = signal(false);
  protected readonly searchText = signal('');
  protected readonly filters = signal({ categoryId: '', isActive: '' });
  protected readonly form = signal<ProductFormState>({
    name: '',
    description: '',
    price: null,
    stock: null,
    categoryId: '',
    subCategoryId: '',
    isActive: true,
  });

  protected readonly columns: DashboardTableColumn[] = [
    { key: 'image', label: 'Image', width: '12%' },
    { key: 'name', label: 'Name', width: '24%' },
    { key: 'category', label: 'Category', width: '18%' },
    { key: 'price', label: 'Price', width: '14%', align: 'right' },
    { key: 'stock', label: 'Stock', width: '14%', align: 'right' },
    { key: 'active', label: 'Active', width: '10%' },
    { key: 'actions', label: 'Actions', width: '8%', align: 'right' },
  ];

  protected readonly tableRows = computed(() =>
    this.products().map((product) => ({
      _id: product._id,
      image: this.resolveImageUrl(product.image),
      name: product.name,
      category: this.resolveCategoryLabel(product.categoryId),
      price: this.formatCurrency(product.price),
      stock: product.stock,
      active: product.isActive ?? true,
      actions: product._id,
    })),
  );

  protected readonly statCards = computed(() => {
    const list = this.products();
    const activeCount = list.filter((item) => item.isActive).length;
    const outOfStock = list.filter((item) => item.stock === 0).length;
    const lowStock = list.filter((item) => item.stock > 0 && item.stock <= 3).length;
    return [
      { title: 'Products', value: this.totalItems(), icon: 'inventory_2', color: 'gold' as const },
      { title: 'Active', value: activeCount, icon: 'check_circle', color: 'green' as const },
      { title: 'Out of Stock', value: outOfStock, icon: 'error', color: 'red' as const },
      {
        title: 'Low Stock',
        value: lowStock,
        icon: 'warning',
        color: lowStock > 0 ? ('red' as const) : ('blue' as const),
      },
    ];
  });

  constructor() {
    this.loadCategories();
    this.fetchProducts();

    effect(() => {
      const categoryId = this.form().categoryId;
      if (!categoryId) {
        this.formSubcategories.set([]);
        return;
      }

      this.loadingSubcategories.set(true);
      this.categoriesService.getSubcategories(categoryId).subscribe({
        next: (items) => {
          this.formSubcategories.set(
            items.map((item) => ({ id: item._id, name: item.title })),
          );
          this.loadingSubcategories.set(false);
        },
        error: () => {
          this.formSubcategories.set([]);
          this.loadingSubcategories.set(false);
        },
      });
    });
  }

  protected fetchProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productsService
      .getProducts({
        page: this.currentPage(),
        limit: this.pageSize(),
        categoryId: this.filters().categoryId || undefined,
        isActive: this.filters().isActive || undefined,
        search: this.searchText().trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          const items = (response.data.items ?? []).map((item) => this.normalizeProduct(item));
          const pagination = response.data.pagination;
          this.products.set(items);
          this.totalItems.set(pagination?.total ?? items.length);
          this.currentPage.set(pagination?.page ?? this.currentPage());
          this.totalPages.set(pagination?.totalPages ?? 1);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Unable to load products.');
          this.loading.set(false);
        },
      });
  }

  protected loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (items) => {
        this.categories.set(items.map((item) => ({ id: item._id, name: item.title })));
      },
      error: () => this.categories.set([]),
    });
  }

  protected openCreateModal(): void {
    this.selectedProduct.set(null);
    this.imageFile.set(null);
    this.imagePreview.set('');
    this.form.set({
      name: '',
      description: '',
      price: null,
      stock: null,
      categoryId: '',
      subCategoryId: '',
      isActive: true,
    });
    this.showForm.set(true);
  }

  protected openEditModal(product: Product): void {
    this.selectedProduct.set(product);
    this.imageFile.set(null);
    this.imagePreview.set(this.resolveImageUrl(product.image));
    this.form.set({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId?._id ?? '',
      subCategoryId: product.subCategoryId?._id ?? '',
      isActive: product.isActive ?? true,
    });
    this.showForm.set(true);
  }

  protected closeForm(): void {
    if (this.submitting()) return;
    this.showForm.set(false);
  }

  protected onCategoryChange(categoryId: string): void {
    this.form.update((value) => ({
      ...value,
      categoryId,
      subCategoryId: '',
    }));
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.imageFile.set(file);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  }

  protected saveProduct(): void {
    const form = this.form();
    const selected = this.selectedProduct();
    const missingRequired =
      !form.name.trim() ||
      !form.description.trim() ||
      form.price === null ||
      form.stock === null ||
      !form.categoryId ||
      !form.subCategoryId ||
      (!selected && !this.imageFile());

    if (missingRequired) {
      this.showToast('Please fill all required fields.');
      return;
    }

    const payload = this.buildFormData(form);
    this.submitting.set(true);

    const request$ = selected
      ? this.productsService.updateProduct(selected._id, payload)
      : this.productsService.createProduct(payload);

    request$.subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.showForm.set(false);
        this.showToast(selected ? 'Product updated.' : 'Product created.');
        if (selected) {
          this.products.update((list) =>
            list.map((item) =>
              item._id === selected._id
                ? this.normalizeProduct({ ...item, ...response.data })
                : item,
            ),
          );
        } else {
          this.fetchProducts();
        }
      },
      error: () => {
        this.submitting.set(false);
        this.showToast('Failed to save product.');
      },
    });
  }

  protected toggleProduct(product: Product, event: Event): void {
    event.stopPropagation();
    const nextActive = !(product.isActive ?? true);
    const payload = this.buildFormData(
      {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId._id,
        subCategoryId: product.subCategoryId._id,
        isActive: nextActive,
      },
    );

    this.productsService.updateProduct(product._id, payload).subscribe({
      next: () => {
        this.products.update((list) =>
          list.map((item) =>
            item._id === product._id ? { ...item, isActive: nextActive } : item,
          ),
        );
        this.showToast('Status updated.');
      },
      error: () => this.showToast('Failed to update status.'),
    });
  }

  protected deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    this.productsService.deleteProduct(product._id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((item) => item._id !== product._id));
        this.totalItems.update((value) => Math.max(0, value - 1));
        this.showToast('Product deleted.');
      },
      error: () => this.showToast('Failed to delete product.'),
    });
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.fetchProducts();
  }

  protected nextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((value) => value + 1);
    this.fetchProducts();
  }

  protected previousPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((value) => value - 1);
    this.fetchProducts();
  }

  protected showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  protected asProduct(row: Record<string, unknown>): Product | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.products().find((item) => item._id === id) ?? null;
  }

  protected asText(value: unknown): string {
    return String(value ?? '');
  }

  protected asNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private buildFormData(form: ProductFormState): FormData {
    const payload = new FormData();
    payload.append('name', form.name.trim());
    payload.append('description', form.description.trim());
    payload.append('price', String(form.price));
    payload.append('stock', String(form.stock));
    payload.append('categoryId', form.categoryId);
    payload.append('subCategoryId', form.subCategoryId);
    payload.append('isActive', String(form.isActive));
    if (this.imageFile()) {
      payload.append('image', this.imageFile()!);
    }
    return payload;
  }

  private normalizeProduct(product: Product): Product {
    return {
      ...product,
      categoryId: this.normalizeRef(product.categoryId),
      subCategoryId: this.normalizeRef(product.subCategoryId),
      isActive: product.isActive ?? true,
    };
  }

  private normalizeRef(
    ref: string | CategoryRef | undefined,
  ): CategoryRef {
    if (!ref) {
      return { _id: '', name: '-' };
    }
    if (typeof ref === 'string') {
      const category = this.categories().find((item) => item.id === ref);
      return { _id: ref, name: category?.name ?? '-' };
    }
    return ref;
  }

  private resolveCategoryLabel(ref: CategoryRef): string {
    if (ref.name && ref.name !== '-') {
      return ref.name;
    }
    return this.categories().find((item) => item.id === ref._id)?.name ?? '-';
  }

  private resolveImageUrl(image: string): string {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `${this.baseUrl}${image}`;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
