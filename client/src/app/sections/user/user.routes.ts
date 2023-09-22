import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user.component').then((m) => m.UserComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Chats.Root,
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('./components/chats/chat.routes').then((m) => m.routes),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./components/contacts/contact.routes').then((m) => m.routes),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'search-users',
        loadComponent: () =>
          import('./components/search-users/search-users.component').then(
            (m) => m.SearchUsersComponent
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./components/settings/settings.routes').then((m) => m.routes),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Chats.Root,
      },
    ],
  },
];
