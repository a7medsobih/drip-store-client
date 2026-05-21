import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { filter, map, of, take } from 'rxjs';

import { AuthService } from '@auth/auth.service';

function redirectToLogin(router: Router): UrlTree {
  return router.createUrlTree(['/login']);
}

function redirectToHome(router: Router): UrlTree {
  return router.createUrlTree(['/']);
}

function waitForAuthInitialized(authService: AuthService) {
  if (authService.authInitialized()) {
    return of(true);
  }

  return toObservable(authService.authInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
  );
}

function checkAdminAccess() {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForAuthInitialized(authService).pipe(
    map(() => {
      if (!authService.isAuthenticated()) {
        return redirectToLogin(router);
      }

      if (!authService.isAdmin()) {
        return redirectToHome(router);
      }

      return true;
    }),
  );
}

export const adminGuard: CanActivateFn = () => checkAdminAccess();
export const adminChildGuard: CanActivateChildFn = () => checkAdminAccess();
