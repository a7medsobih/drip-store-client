import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import {
  CatalogCategory,
  CatalogSubcategory,
  CategoryPayload,
  SubcategoryPayload,
} from '@dashboard/models/dashboard.models';
import { environment } from '../../../environments/env-development';

type ListPayload<T> = T[] | { items?: T[] };

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getCategories(): Observable<CatalogCategory[]> {
    return this.http
      .get<ApiResponse<ListPayload<CatalogCategory>>>(`${this.baseUrl}/api/v1/categories`)
      .pipe(map((response) => this.unwrapList(response.data)));
  }

  createCategory(payload: CategoryPayload): Observable<ApiResponse<CatalogCategory>> {
    return this.http.post<ApiResponse<CatalogCategory>>(
      `${this.baseUrl}/admin/v1/categories`,
      payload,
    );
  }

  updateCategory(
    id: string,
    payload: CategoryPayload,
  ): Observable<ApiResponse<CatalogCategory>> {
    return this.http.put<ApiResponse<CatalogCategory>>(
      `${this.baseUrl}/admin/v1/categories/${id}`,
      payload,
    );
  }

  deleteCategory(id: string): Observable<ApiResponse<CatalogCategory>> {
    return this.http.delete<ApiResponse<CatalogCategory>>(
      `${this.baseUrl}/admin/v1/categories/${id}`,
    );
  }

  getSubcategories(categoryId: string): Observable<CatalogSubcategory[]> {
    return this.http
      .get<ApiResponse<ListPayload<CatalogSubcategory>>>(
        `${this.baseUrl}/api/v1/subcategories/${categoryId}/subcategories`,
      )
      .pipe(map((response) => this.unwrapList(response.data)));
  }

  createSubcategory(
    payload: SubcategoryPayload,
  ): Observable<ApiResponse<CatalogSubcategory>> {
    return this.http.post<ApiResponse<CatalogSubcategory>>(
      `${this.baseUrl}/admin/v1/subcategories`,
      payload,
    );
  }

  updateSubcategory(
    id: string,
    payload: Partial<SubcategoryPayload>,
  ): Observable<ApiResponse<CatalogSubcategory>> {
    return this.http.put<ApiResponse<CatalogSubcategory>>(
      `${this.baseUrl}/admin/v1/subcategories/${id}`,
      payload,
    );
  }

  deleteSubcategory(id: string): Observable<ApiResponse<CatalogSubcategory>> {
    return this.http.delete<ApiResponse<CatalogSubcategory>>(
      `${this.baseUrl}/admin/v1/subcategories/${id}`,
    );
  }

  private unwrapList<T>(data: ListPayload<T>): T[] {
    if (Array.isArray(data)) {
      return data;
    }
    return data.items ?? [];
  }
}
