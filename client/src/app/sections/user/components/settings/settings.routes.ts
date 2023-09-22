import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings.component').then((m) => m.SettingsComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Settings.Personal,
      },
      {
        path: 'personal',
        loadComponent: () =>
          import('./components/personal/personal.component').then(
            (m) => m.PersonalComponent
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./components/account/account.component').then(
            (m) => m.AccountComponent
          ),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Settings.Personal,
      },
    ],
  },
];
