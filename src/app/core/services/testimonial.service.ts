import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { Testimonial } from '@core/models/testimonial.model';

import { environment } from '../../../environments/env-development';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.baseURL;

  getPublicTestimonials(): Observable<Testimonial[]> {
    return this.http
      .get<ApiResponse<Testimonial[]>>(`${this.base}/api/v1/testimonials/public`)
      .pipe(map((response) => response.data));
  }
}
