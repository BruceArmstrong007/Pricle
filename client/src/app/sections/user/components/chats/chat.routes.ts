import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./chats.component').then((m) => m.ChatsComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/no-chat/no-chat.component').then(
            (m) => m.NoChatComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/chat-ui/chat-ui.component').then(
            (m) => m.ChatUiComponent
          ),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ClientRoutes.User.Chats.Root,
      },
    ],
  },
];
