import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Routes } from '../utils/client.routes';
import { CookieService } from 'ngx-cookie-service';

export const userGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const isLoggedIn = cookieService.get('isLoggedIn');
  if (isLoggedIn == 'true') {
    return true;
  }
  router.navigateByUrl(Routes.Auth.Root);
  return false;
};
