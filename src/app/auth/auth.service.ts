import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { environment } from '../../environments/env-development';
import { ApiResponse } from '@core/models/api-response.model';
import {
  AuthResponseData,
  AuthUser,
  ForgotPasswordResponseData,
  ProfileResponse,
  RefreshTokenResponseData,
  RegisterPayload,
  RegisterResponseData,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from './auth.models';

const REFRESH_TOKEN_STORAGE_KEY = 'drip.refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.baseURL;

  private refreshRequest$: Observable<string> | null = null;

  readonly currentUser = signal<AuthUser | null>(null);
  readonly accessToken = signal<string | null>(null);
  readonly authInitialized = signal(false);
  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(
        `${this.baseUrl}/api/v1/auth/login`,
        { email: email.trim(), password },
        { withCredentials: true },
      )
      .pipe(
        map((response) => response.data),
        tap((data) => this.setSession(data)),
      );
  }

  register(payload: RegisterPayload): Observable<RegisterResponseData> {
    return this.http
      .post<ApiResponse<RegisterResponseData>>(
        `${this.baseUrl}/api/v1/auth/register`,
        payload,
      )
      .pipe(map((response) => response.data));
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponseData> {
    return this.http
      .post<ApiResponse<ForgotPasswordResponseData>>(
        `${this.baseUrl}/api/v1/auth/forgot-password`,
        { email },
      )
      .pipe(map((response) => response.data));
  }

  verifyOtp(payload: VerifyOtpPayload): Observable<AuthUser> {
    return this.http
      .post<ApiResponse<{ user: AuthUser }>>(
        `${this.baseUrl}/api/v1/auth/verify-otp`,
        payload,
      )
      .pipe(map((response) => response.data.user));
  }

  resetPassword(payload: ResetPasswordPayload): Observable<AuthUser> {
    return this.http
      .post<ApiResponse<{ user: AuthUser }>>(
        `${this.baseUrl}/api/v1/auth/reset-password`,
        payload,
      )
      .pipe(map((response) => response.data.user));
  }

  refreshToken(): Observable<string> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const storedRefreshToken = this.getPersistedRefreshToken();
    const body = storedRefreshToken ? { refreshToken: storedRefreshToken } : {};

    this.refreshRequest$ = this.http
      .post<ApiResponse<RefreshTokenResponseData>>(
        `${this.baseUrl}/api/v1/auth/refresh-token`,
        body,
        { withCredentials: true },
      )
      .pipe(
        map((response) => response.data.accessToken),
        tap((token) => {
          if (!token) {
            throw new Error('Missing access token');
          }

          this.accessToken.set(token);
        }),
        shareReplay(1),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
      );

    return this.refreshRequest$;
  }

  fetchProfile(): Observable<AuthUser> {
    return this.http
      .get<ApiResponse<ProfileResponse>>(`${this.baseUrl}/api/v1/user/profile`)
      .pipe(
        map((response) => this.mapProfileUser(response.data)),
        tap((user) => this.currentUser.set(user)),
      );
  }

  restoreSession(): Observable<void> {
    this.authInitialized.set(false);

    return this.refreshToken().pipe(
      switchMap(() => this.fetchProfile()),
      map(() => undefined),
      catchError(() => {
        this.clearSession();
        return of(undefined);
      }),
      finalize(() => {
        this.authInitialized.set(true);
      }),
    );
  }

  logout(): void {
    this.clearSession();

    const redirectTo = this.router.url.startsWith('/dashboard') ? '/login' : '/';
    void this.router.navigate([redirectTo]);
  }

  private setSession(data: AuthResponseData): void {
    const token = data.accessToken ?? data.tokens?.accessToken ?? null;
    const refresh = data.tokens?.refreshToken ?? null;

    if (token) {
      this.accessToken.set(token);
    }

    if (refresh) {
      this.persistRefreshToken(refresh);
    }

    if (data.user) {
      this.currentUser.set(data.user);
    }
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.clearPersistedRefreshToken();
  }

  private getPersistedRefreshToken(): string | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  private persistRefreshToken(token: string): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  }

  private clearPersistedRefreshToken(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  private mapProfileUser(profile: ProfileResponse): AuthUser {
    return {
      id: profile.id ?? profile._id,
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      gender: profile.gender,
      role: profile.role,
      emailConsent: profile.emailConsent,
      isActive: profile.isActive,
      isVerified: profile.isVerified,
    };
  }
}
