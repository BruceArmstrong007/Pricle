import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { API } from 'src/app/shared/utils/api.endpoints';
import { userActions } from './user.action';
import { EditProfileStore } from 'src/app/sections/user/components/profile/components/profile-edit/store/edit-profile.store';
import { Store } from '@ngrx/store';
import { authActions } from '../auth/auth.action';
import { contactsActions } from '../contacts/contacts.action';
import { channelsActions } from '../channels/channels.action';
import { onlineFriendsActions } from '../online-friends/online-friends.action';
import { Router } from '@angular/router';
import { Routes } from 'src/app/shared/utils/client.routes';
import { ChangePasswordStore } from 'src/app/sections/user/components/settings/components/account/components/change-password/store/change-password.store';
import { ChangeEmailStore } from 'src/app/sections/user/components/settings/components/account/components/change-email/store/change-email.store';
import { MessageSocketService } from 'src/app/shared/sockets/message-socket/message-socket.service';
import { UserSocketService } from 'src/app/shared/sockets/user-socket/user-socket.service';
import { CookieService } from 'ngx-cookie-service';

export const profile = createEffect(
  (actions$ = inject(Actions), apiService = inject(ApiService)) => {
    return actions$.pipe(
      ofType(userActions.profile),
      exhaustMap((request) => {
        return apiService.request(API.PROFILE, request).pipe(
          map((response: any) => {
            return userActions.profileSuccess(response);
          }),
          catchError(({ error }) => {
            return of(userActions.profileFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const updateUser = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    store = inject(Store),
    editStore = inject(EditProfileStore)
  ) => {
    return actions$.pipe(
      ofType(userActions.updateUser),
      exhaustMap((request) => {
        editStore.EditProfile();
        return apiService.request(API.UPDATEUSER, request).pipe(
          map((response: any) => {
            editStore.EditProfileSuccess(response);
            store.dispatch(userActions.profile());
            return userActions.updateUserSuccess();
          }),
          catchError(({ error }) => {
            editStore.EditProfileFailure(error);
            return of(userActions.updateUserFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const uploadProfile = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    store = inject(Store),
    editStore = inject(EditProfileStore)
  ) => {
    return actions$.pipe(
      ofType(userActions.uploadProfile),
      exhaustMap((request) => {
        editStore.EditProfile();
        return apiService.uploadProfile(API.UPLOADPROFILE, request).pipe(
          map((response: any) => {
            editStore.EditProfileSuccess(response);
            store.dispatch(userActions.profile());
            return userActions.uploadProfileSuccess();
          }),
          catchError(({ error }) => {
            editStore.EditProfileFailure(error);
            return of(userActions.uploadProfileFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const logout = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    router = inject(Router),
    messageSocket = inject(MessageSocketService),
    userSocket = inject(UserSocketService),
    apiService = inject(ApiService),
  ) => {
    return actions$.pipe(
      ofType(userActions.logout),
      exhaustMap(() => {
        return apiService.request(API.LOGOUT).pipe(
          map(() => {
            messageSocket.disconnect();
            userSocket.disconnect();
            store.dispatch(authActions.resetState());
            store.dispatch(contactsActions.resetState());
            store.dispatch(channelsActions.resetState());
            store.dispatch(onlineFriendsActions.resetState());
            store.dispatch(userActions.resetState());
            localStorage.removeItem('isLoggedIn');
            router.navigateByUrl(Routes.Home);
            return userActions.logoutSuccess();
          }),
          catchError(({ error }) => {
            return of(userActions.logoutFailure());
          })
        );
      })

    );
  },
  {
    functional: true,
  }
);

export const deleteUser = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(userActions.deleteAccount),
      exhaustMap(() => {
        return apiService.request(API.DELETEUSER).pipe(
          map((response: any) => {
            store.dispatch(userActions.logout());
            return userActions.deleteAccountSuccess();
          }),
          catchError(({ error }) => {
            return of(userActions.deleteAccountFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const changePassword = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    changePasswordStore = inject(ChangePasswordStore)
  ) => {
    return actions$.pipe(
      ofType(userActions.resetPassword),
      exhaustMap((request) => {
        changePasswordStore.ChangePassword();
        return apiService.request(API.CHANGEPASSWORD, request).pipe(
          map((response: any) => {
            changePasswordStore.ChangePasswordSuccess(response);
            return userActions.resetPasswordSuccess();
          }),
          catchError(({ error }) => {
            changePasswordStore.ChangePasswordFailure(error);
            return of(userActions.resetPasswordFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const changeEmailLink = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    changeEmailStore = inject(ChangeEmailStore)
  ) => {
    return actions$.pipe(
      ofType(userActions.changeEmailLink),
      exhaustMap((request) => {
        changeEmailStore.ChangeEmailLink();
        return apiService.request(API.CHANGEEMAILLINK, request).pipe(
          map((response: any) => {
            changeEmailStore.ChangeEmailLinkSuccess(response);
            return userActions.changeEmailLinkSuccess();
          }),
          catchError(({ error }) => {
            changeEmailStore.ChangeEmailLinkFailure(error);
            return of(userActions.changeEmailLinkFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const changeEmailVerification = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    changeEmailStore = inject(ChangeEmailStore)
  ) => {
    return actions$.pipe(
      ofType(userActions.changeEmail),
      exhaustMap((request) => {
        changeEmailStore.ChangeEmail();
        return apiService.request(API.CHANGEEMAIL, request).pipe(
          map((response: any) => {
            changeEmailStore.ChangeEmailSuccess(response);
            return userActions.changeEmailSuccess();
          }),
          catchError(({ error }) => {
            changeEmailStore.ChangeEmailFailure(error);
            return of(userActions.changeEmailFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);
