import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Routes } from '../utils/client.routes';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const isLoggedIn = cookieService.get('isLoggedIn');
  if (isLoggedIn !== 'true') {
    return true;
  }
  router.navigateByUrl(Routes.User.Root);
  return false;
};
