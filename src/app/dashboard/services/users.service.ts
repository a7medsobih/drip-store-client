import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { User, UsersListData, UsersQueryParams } from '@dashboard/models/dashboard.models';
import { environment } from '../../../environments/env-development';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;

  getUsers(params: UsersQueryParams): Observable<ApiResponse<UsersListData>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('limit', String(params.limit));

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ApiResponse<UsersListData>>(
      `${this.baseUrl}/api/v1/admin/users`,
      { params: httpParams },
    );
  }

  toggleActive(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}/api/v1/admin/users/${id}/toggle`,
      {},
    );
  }
}
