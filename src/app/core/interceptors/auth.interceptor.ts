import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '@auth/auth.service';

const AUTH_EXCLUDED_ROUTES = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/verify-otp',
  '/api/v1/auth/reset-password',
];

function isAuthExcludedRoute(url: string): boolean {
  return AUTH_EXCLUDED_ROUTES.some((route) => url.includes(route));
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const accessToken = authService.accessToken();
  const isExcludedRoute = isAuthExcludedRoute(req.url);
  const isRefreshRoute = req.url.includes('/api/v1/auth/refresh-token');

  const authRequest =
    accessToken && !isExcludedRoute
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isExcludedRoute
      ) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((refreshedToken) =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedToken}`,
              },
            }),
          ),
        ),
        catchError((refreshError) => {
          if (authService.authInitialized() && !isRefreshRoute) {
            authService.logout();
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
