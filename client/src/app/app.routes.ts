import { Routes } from '@angular/router';
import { Routes as ClientRoutes } from 'src/app/shared/utils/client.routes';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { channelsFeature } from './stores/channels/channels.reducer';
import * as userEffects from './stores/user/user.effect';
import * as searchUsersEffects from './stores/search-users/search-users.effect';
import * as contactEffects from './stores/contacts/contacts.effect';
import { tokenResolver } from './shared/resolvers/token.resolver';
import { userGuard } from './shared/guards/user.guard';
import { authGuard } from './shared/guards/auth.guard';
import { EditProfileStore } from './sections/user/components/profile/components/profile-edit/store/edit-profile.store';
import { SearchUsersStore } from './sections/user/components/search-users/store/search-users.store';
import { onlineFriendsFeature } from './stores/online-friends/online-friends.reducer';
import { ChangePasswordStore } from './sections/user/components/settings/components/account/components/change-password/store/change-password.store';
import { ChangeEmailStore } from './sections/user/components/settings/components/account/components/change-email/store/change-email.store';

export const routes: Routes = [
  {
    path: 'auth',
    resolve: [authGuard],
    loadChildren: () =>
      import('./sections/auth/auth.routes').then((m) => m.routes),
    providers: [],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    resolve: [tokenResolver],
    loadChildren: () =>
      import('./sections/user/user.routes').then((m) => m.routes),
    providers: [
      ChangePasswordStore,
      ChangeEmailStore,
      EditProfileStore,
      SearchUsersStore,
      provideState(channelsFeature.name, channelsFeature.reducer),
      provideState(onlineFriendsFeature.name, onlineFriendsFeature.reducer),
      provideEffects([searchUsersEffects, userEffects, contactEffects]),
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./shared/components/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ClientRoutes.User.Chats.Root,
  },
];
