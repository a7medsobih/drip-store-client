import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/env-development';
import { ApiResponse } from '../models/api-response.model';
import {
  Product,
  ProductQueryParams,
  ProductsResponse,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.baseURL;

  getProducts(params: ProductQueryParams = {}): Observable<ProductsResponse> {
    return this.http
      .get<ApiResponse<ProductsResponse>>(`${this.base}/api/v1/products`, {
        params: this.buildHttpParams(params),
      })
      .pipe(map((res) => res.data));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.base}/api/v1/products/new-arrivals`)
      .pipe(map((res) => res.data));
  }

  getBestSellers(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.base}/api/v1/products/best-sellers`)
      .pipe(map((res) => res.data));
  }

  private buildHttpParams(params: ProductQueryParams): HttpParams {
    return Object.entries(params).reduce((httpParams, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return httpParams;
      }

      return httpParams.set(key, String(value));
    }, new HttpParams());
  }
}
