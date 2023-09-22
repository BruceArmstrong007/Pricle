import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Routes } from '../utils/client.routes';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const refreshToken = localStorage.getItem('refresh');
  if(!refreshToken){
    return true;
  }
  router.navigateByUrl(Routes.User.Root);
  return false;
};
