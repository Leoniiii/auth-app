import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '../auth/interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  // const url = state.url;
  // localStorage.setItem('url', url)
  const authService = inject(AuthService);
  const router = inject(Router)
  console.log({ status: authService.AuthStatus() })

  if (authService.AuthStatus() === AuthStatus.authenticated) {
    return true
  }

  router.navigateByUrl('/auth/login')
  return false



  console.log('isAuthenticated', { route, state })
  return true;
};
