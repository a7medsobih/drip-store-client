import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import {
  Order,
  OrdersListResponse,
  OrdersQueryParams,
  OrderStatus,
} from '@dashboard/models/dashboard.models';
import { environment } from '../../../environments/env-development';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getOrders(params: OrdersQueryParams): Observable<ApiResponse<OrdersListResponse>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('limit', String(params.limit));

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ApiResponse<OrdersListResponse>>(
      `${this.baseUrl}/api/v1/orders/admin`,
      { params: httpParams },
    );
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/api/v1/orders/${id}`);
  }

  updateStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/api/v1/orders/${id}/status`, {
      status,
    });
  }
}
