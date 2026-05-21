import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { environment } from '../../../environments/env-development';
import { DashboardOverview } from '@dashboard/models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getOverview(): Observable<ApiResponse<DashboardOverview>> {
    return this.http.get<ApiResponse<DashboardOverview>>(
      `${this.baseUrl}/api/v1/admin/dashboard`,
    );
  }
}
