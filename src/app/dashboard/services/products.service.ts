import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { Product, ProductsResponse } from '@core/models/product.model';
import { ProductsAdminQueryParams } from '@dashboard/models/dashboard.models';
import { environment } from '../../../environments/env-development';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getProducts(
    params: ProductsAdminQueryParams,
  ): Observable<ApiResponse<ProductsResponse>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('limit', String(params.limit));

    if (params.categoryId) {
      httpParams = httpParams.set('categoryId', params.categoryId);
    }
    if (params.isActive) {
      httpParams = httpParams.set('isActive', params.isActive);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ApiResponse<ProductsResponse>>(
      `${this.baseUrl}/api/v1/products`,
      { params: httpParams },
    );
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(
      `${this.baseUrl}/admin/v1/products`,
      formData,
    );
  }

  updateProduct(id: string, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(
      `${this.baseUrl}/admin/v1/products/${id}`,
      formData,
    );
  }

  deleteProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(
      `${this.baseUrl}/admin/v1/products/${id}`,
    );
  }
}
