import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Routes } from '../utils/client.routes';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    return true;
  }
  router.navigateByUrl(Routes.User.Root);
  return false;
};
