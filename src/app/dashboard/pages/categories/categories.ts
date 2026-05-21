import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DashboardFormSkeleton,
  DashboardPageHeader,
  DashboardTable,
  DashboardTableSkeleton,
} from '@dashboard/components';
import {
  CatalogCategory,
  CatalogSubcategory,
  DashboardTableColumn,
} from '@dashboard/models/dashboard.models';
import { CategoriesService } from '@dashboard/services/categories.service';

type CatalogTab = 'categories' | 'subcategories';

interface CategoryFormState {
  title: string;
  isActive: boolean;
}

interface SubcategoryFormState {
  title: string;
  categoryId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardFormSkeleton,
    DashboardPageHeader,
    DashboardTable,
    DashboardTableSkeleton,
    FormsModule,
  ],
  templateUrl: './categories.html',
})
export class Categories {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly activeTab = signal<CatalogTab>('categories');
  protected readonly categories = signal<CatalogCategory[]>([]);
  protected readonly subcategories = signal<CatalogSubcategory[]>([]);
  protected readonly selectedCategoryId = signal('');
  protected readonly loadingCategories = signal(true);
  protected readonly loadingSubcategories = signal(false);
  protected readonly categoriesError = signal<string | null>(null);
  protected readonly subcategoriesError = signal<string | null>(null);
  protected readonly toast = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly showCategoryForm = signal(false);
  protected readonly showSubcategoryForm = signal(false);
  protected readonly selectedCategory = signal<CatalogCategory | null>(null);
  protected readonly selectedSubcategory = signal<CatalogSubcategory | null>(null);
  protected readonly categoryForm = signal<CategoryFormState>({ title: '', isActive: true });
  protected readonly subcategoryForm = signal<SubcategoryFormState>({
    title: '',
    categoryId: '',
    isActive: true,
  });

  protected readonly categoryColumns: DashboardTableColumn[] = [
    { key: 'title', label: 'Title', width: '50%' },
    { key: 'active', label: 'Active', width: '20%' },
    { key: 'actions', label: 'Actions', width: '30%', align: 'right' },
  ];

  protected readonly subcategoryColumns: DashboardTableColumn[] = [
    { key: 'title', label: 'Title', width: '34%' },
    { key: 'category', label: 'Category', width: '28%' },
    { key: 'active', label: 'Active', width: '18%' },
    { key: 'actions', label: 'Actions', width: '20%', align: 'right' },
  ];

  protected readonly categoryRows = computed(() =>
    this.categories().map((category) => ({
      _id: category._id,
      title: category.title,
      active: category.isActive,
      actions: category._id,
    })),
  );

  protected readonly subcategoryRows = computed(() =>
    this.subcategories().map((subcategory) => ({
      _id: subcategory._id,
      title: subcategory.title,
      category: this.resolveSubcategoryCategory(subcategory),
      active: subcategory.isActive,
      actions: subcategory._id,
    })),
  );

  protected readonly categoryFilterOptions = computed(() =>
    this.categories().map((category) => ({ id: category._id, name: category.title })),
  );

  protected readonly headerActionLabel = computed(() =>
    this.activeTab() === 'categories' ? 'Add Category' : 'Add Subcategory',
  );

  constructor() {
    this.loadCategories();

    effect(() => {
      const categoryId = this.selectedCategoryId();
      if (!categoryId) {
        this.subcategories.set([]);
        return;
      }
      this.loadSubcategories(categoryId);
    });
  }

  protected setTab(tab: CatalogTab): void {
    this.activeTab.set(tab);
  }

  protected onHeaderAction(): void {
    if (this.activeTab() === 'categories') {
      this.openCreateCategory();
      return;
    }
    this.openCreateSubcategory();
  }

  protected loadCategories(): void {
    this.loadingCategories.set(true);
    this.categoriesError.set(null);

    this.categoriesService.getCategories().subscribe({
      next: (items) => {
        this.categories.set(items);
        this.loadingCategories.set(false);
        if (!this.selectedCategoryId() && items.length) {
          this.selectedCategoryId.set(items[0]._id);
        }
      },
      error: () => {
        this.categoriesError.set('Unable to load categories.');
        this.loadingCategories.set(false);
      },
    });
  }

  protected loadSubcategories(categoryId: string): void {
    this.loadingSubcategories.set(true);
    this.subcategoriesError.set(null);

    this.categoriesService.getSubcategories(categoryId).subscribe({
      next: (items) => {
        this.subcategories.set(items);
        this.loadingSubcategories.set(false);
      },
      error: () => {
        this.subcategoriesError.set('Unable to load subcategories.');
        this.subcategories.set([]);
        this.loadingSubcategories.set(false);
      },
    });
  }

  protected openCreateCategory(): void {
    this.selectedCategory.set(null);
    this.categoryForm.set({ title: '', isActive: true });
    this.showCategoryForm.set(true);
  }

  protected openEditCategory(category: CatalogCategory): void {
    this.selectedCategory.set(category);
    this.categoryForm.set({ title: category.title, isActive: category.isActive });
    this.showCategoryForm.set(true);
  }

  protected closeCategoryForm(): void {
    if (this.submitting()) return;
    this.showCategoryForm.set(false);
  }

  protected saveCategory(): void {
    const form = this.categoryForm();
    if (!form.title.trim()) {
      this.showToast('Category title is required.');
      return;
    }

    const payload = { title: form.title.trim(), isActive: form.isActive };
    const selected = this.selectedCategory();
    this.submitting.set(true);

    const request$ = selected
      ? this.categoriesService.updateCategory(selected._id, payload)
      : this.categoriesService.createCategory(payload);

    request$.subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.showCategoryForm.set(false);
        this.showToast(selected ? 'Category updated.' : 'Category created.');
        if (selected) {
          this.categories.update((list) =>
            list.map((item) => (item._id === selected._id ? response.data : item)),
          );
        } else {
          this.categories.update((list) => [...list, response.data]);
        }
      },
      error: () => {
        this.submitting.set(false);
        this.showToast('Failed to save category.');
      },
    });
  }

  protected deleteCategory(category: CatalogCategory, event: Event): void {
    event.stopPropagation();
    const confirmed = window.confirm(
      'Deleting this category will also disable related subcategories and products.',
    );
    if (!confirmed) return;

    this.categoriesService.deleteCategory(category._id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((item) => item._id !== category._id));
        if (this.selectedCategoryId() === category._id) {
          const next = this.categories()[0]?._id ?? '';
          this.selectedCategoryId.set(next);
        }
        this.showToast('Category deleted.');
      },
      error: () => this.showToast('Failed to delete category.'),
    });
  }

  protected openCreateSubcategory(): void {
    this.selectedSubcategory.set(null);
    this.subcategoryForm.set({
      title: '',
      categoryId: this.selectedCategoryId(),
      isActive: true,
    });
    this.showSubcategoryForm.set(true);
  }

  protected openEditSubcategory(subcategory: CatalogSubcategory): void {
    this.selectedSubcategory.set(subcategory);
    this.subcategoryForm.set({
      title: subcategory.title,
      categoryId: this.resolveSubcategoryCategoryId(subcategory),
      isActive: subcategory.isActive,
    });
    this.showSubcategoryForm.set(true);
  }

  protected closeSubcategoryForm(): void {
    if (this.submitting()) return;
    this.showSubcategoryForm.set(false);
  }

  protected saveSubcategory(): void {
    const form = this.subcategoryForm();
    if (!form.title.trim() || !form.categoryId) {
      this.showToast('Subcategory title and category are required.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      categoryId: form.categoryId,
      isActive: form.isActive,
    };
    const selected = this.selectedSubcategory();
    this.submitting.set(true);

    const request$ = selected
      ? this.categoriesService.updateSubcategory(selected._id, payload)
      : this.categoriesService.createSubcategory(payload);

    request$.subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.showSubcategoryForm.set(false);
        this.showToast(selected ? 'Subcategory updated.' : 'Subcategory created.');
        const categoryId = this.resolveSubcategoryCategoryId(response.data);
        if (categoryId === this.selectedCategoryId()) {
          if (selected) {
            this.subcategories.update((list) =>
              list.map((item) => (item._id === selected._id ? response.data : item)),
            );
          } else {
            this.subcategories.update((list) => [...list, response.data]);
          }
        } else {
          this.loadSubcategories(this.selectedCategoryId());
        }
      },
      error: () => {
        this.submitting.set(false);
        this.showToast('Failed to save subcategory.');
      },
    });
  }

  protected deleteSubcategory(subcategory: CatalogSubcategory, event: Event): void {
    event.stopPropagation();
    const confirmed = window.confirm(`Delete "${subcategory.title}"?`);
    if (!confirmed) return;

    this.categoriesService.deleteSubcategory(subcategory._id).subscribe({
      next: () => {
        this.subcategories.update((list) =>
          list.filter((item) => item._id !== subcategory._id),
        );
        this.showToast('Subcategory deleted.');
      },
      error: () => this.showToast('Failed to delete subcategory.'),
    });
  }

  protected toggleCategory(category: CatalogCategory, event: Event): void {
    event.stopPropagation();
    const payload = { title: category.title, isActive: !category.isActive };
    this.categoriesService.updateCategory(category._id, payload).subscribe({
      next: (response) => {
        this.categories.update((list) =>
          list.map((item) => (item._id === category._id ? response.data : item)),
        );
      },
      error: () => this.showToast('Failed to update category status.'),
    });
  }

  protected toggleSubcategory(subcategory: CatalogSubcategory, event: Event): void {
    event.stopPropagation();
    const payload = {
      title: subcategory.title,
      categoryId: this.resolveSubcategoryCategoryId(subcategory),
      isActive: !subcategory.isActive,
    };
    this.categoriesService.updateSubcategory(subcategory._id, payload).subscribe({
      next: (response) => {
        this.subcategories.update((list) =>
          list.map((item) => (item._id === subcategory._id ? response.data : item)),
        );
      },
      error: () => this.showToast('Failed to update subcategory status.'),
    });
  }

  protected asCategory(row: Record<string, unknown>): CatalogCategory | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.categories().find((item) => item._id === id) ?? null;
  }

  protected asSubcategory(row: Record<string, unknown>): CatalogSubcategory | null {
    const id = row['_id'];
    if (typeof id !== 'string') return null;
    return this.subcategories().find((item) => item._id === id) ?? null;
  }

  protected showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  private resolveSubcategoryCategoryId(subcategory: CatalogSubcategory): string {
    if (typeof subcategory.categoryId === 'string') {
      return subcategory.categoryId;
    }
    return subcategory.categoryId._id;
  }

  private resolveSubcategoryCategory(subcategory: CatalogSubcategory): string {
    if (typeof subcategory.categoryId === 'object') {
      return subcategory.categoryId.name;
    }
    return (
      this.categories().find((item) => item._id === subcategory.categoryId)?.title ?? '-'
    );
  }
}
