import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./contacts.component').then((m) => m.ContactsComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Contacts.Friends,
      },
      {
        path: 'friends',
        loadComponent: () =>
          import('./components/friends/friends.component').then(
            (m) => m.FriendsComponent
          ),
      },
      {
        path: 'received-requests',
        loadComponent: () =>
          import(
            './components/received-requests/received-requests.component'
          ).then((m) => m.ReceivedRequestsComponent),
      },
      {
        path: 'sent-requests',
        loadComponent: () =>
          import('./components/sent-requests/sent-requests.component').then(
            (m) => m.SentRequestsComponent
          ),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Contacts.Friends,
      },
    ],
  },
];
