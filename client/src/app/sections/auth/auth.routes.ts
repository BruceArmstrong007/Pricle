import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth.component').then((m) => m.AuthComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ClientRoutes.Auth.Login,
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./components/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: 'verify-account',
        loadComponent: () =>
          import('./components/verify-account/verify-account.component').then(
            (m) => m.VerifyAccountComponent
          ),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ClientRoutes.Auth.Login,
      },
    ],
  },
];
