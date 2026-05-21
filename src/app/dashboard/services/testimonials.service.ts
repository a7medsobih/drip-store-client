import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import {
  AdminTestimonial,
  TestimonialStatus,
  TestimonialsListData,
  TestimonialsQueryParams,
} from '@dashboard/models/dashboard.models';
import { environment } from '../../../environments/env-development';

@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getTestimonials(
    params: TestimonialsQueryParams,
  ): Observable<ApiResponse<TestimonialsListData>> {
    let httpParams = new HttpParams().set('page', String(params.page));

    if (params.limit) {
      httpParams = httpParams.set('limit', String(params.limit));
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.stars) {
      httpParams = httpParams.set('stars', params.stars);
    }
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }

    return this.http.get<ApiResponse<TestimonialsListData>>(
      `${this.baseUrl}/api/v1/testimonials/admin`,
      { params: httpParams },
    );
  }

  updateStatus(
    id: string,
    status: Extract<TestimonialStatus, 'approved' | 'refused'>,
  ): Observable<ApiResponse<AdminTestimonial>> {
    return this.http.patch<ApiResponse<AdminTestimonial>>(
      `${this.baseUrl}/api/v1/testimonials/${id}/status`,
      { status },
    );
  }
}
