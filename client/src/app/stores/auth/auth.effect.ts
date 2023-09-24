import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { authActions } from './auth.action';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { API } from 'src/app/shared/utils/api.endpoints';
import { LoginStore } from 'src/app/sections/auth/components/login/store/login.store';
import { RegisterStore } from 'src/app/sections/auth/components/register/store/register.store';
import { Router } from '@angular/router';
import { VerifyAccountStore } from 'src/app/sections/auth/components/verify-account/store/verify-account.store';
import { ResetPasswordStore } from 'src/app/sections/auth/components/reset-password/store/reset-password.store';
import { Routes } from 'src/app/shared/utils/client.routes';
import { Store } from '@ngrx/store';
import { contactsActions } from '../contacts/contacts.action';
import { channelsActions } from '../channels/channels.action';
import { onlineFriendsActions } from '../online-friends/online-friends.action';
import { userActions } from '../user/user.action';
import { CookieService } from 'ngx-cookie-service';

export const login = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    loginStore = inject(LoginStore),
    router = inject(Router),
    cookieService = inject(CookieService)
  ) => {
    return actions$.pipe(
      ofType(authActions.login),
      exhaustMap((request) => {
        loginStore.Login();
        return apiService.request(API.LOGIN, request).pipe(
          map((response: any) => {
            const refreshtoken = cookieService.get('refreshToken');
            response = { ...response, refreshtoken };
            localStorage.setItem('isLoggedIn', 'true');
            loginStore.LoginSuccess(response);
            router.navigateByUrl(Routes.User.Root);
            return authActions.loginSuccess(response);
          }),
          catchError(({ error }) => {
            loginStore.LoginFailure(error);
            return of(authActions.loginFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const register = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    registerStore = inject(RegisterStore),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(authActions.register),
      exhaustMap((request: any) => {
        registerStore.Register();
        return apiService.request(API.REGISTER, request).pipe(
          map((response: any) => {
            registerStore.RegisterSuccess(response);
            const encoded = btoa(
              JSON.stringify({ email: request.email, token: null })
            );
            router.navigateByUrl(`/auth/verify-account?token=${encoded}`);
            return authActions.registerSuccess();
          }),
          catchError(({ error }) => {
            registerStore.RegisterFailure(error);
            return of(authActions.registerFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const verifyEmailLink = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    verifyAccountStore = inject(VerifyAccountStore)
  ) => {
    return actions$.pipe(
      ofType(authActions.verifyEmailLink),
      exhaustMap((request) => {
        verifyAccountStore.VerifyAccountLink();
        return apiService.request(API.VERIFY_EMAIL_LINK, request).pipe(
          map((response: any) => {
            const res: any = { request, response };
            verifyAccountStore.VerifyAccountLinkSuccess(res);
            return authActions.verifyEmailLinkSuccess();
          }),
          catchError(({ error }) => {
            verifyAccountStore.VerifyAccountLinkFailure(error);
            return of(authActions.verifyEmailLinkFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const verifyEmail = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    router = inject(Router),
    verifyAccountStore = inject(VerifyAccountStore)
  ) => {
    return actions$.pipe(
      ofType(authActions.verifyEmail),
      exhaustMap((request) => {
        verifyAccountStore.VerifyAccount();
        return apiService.request(API.VERIFY_EMAIL, request).pipe(
          map((response: any) => {
            verifyAccountStore.VerifyAccountSuccess(response);
            router.navigateByUrl(Routes.Auth.Login);
            return authActions.verifyEmailSuccess();
          }),
          catchError(({ error }) => {
            verifyAccountStore.VerifyAccountFailure(error);
            return of(authActions.verifyEmailFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const resetPasswordLink = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    resetPasswordStore = inject(ResetPasswordStore)
  ) => {
    return actions$.pipe(
      ofType(authActions.resetPasswordLink),
      exhaustMap((request) => {
        resetPasswordStore.ResetPasswordLink();
        return apiService.request(API.RESET_PASSWORD_LINK, request).pipe(
          map((response: any) => {
            resetPasswordStore.ResetPasswordLinkSuccess(response);
            return authActions.resetPasswordLinkSuccess();
          }),
          catchError(({ error }) => {
            resetPasswordStore.ResetPasswordLinkFailure(error);
            return of(authActions.resetPasswordLinkFailure());
          })
        );
      })
    );
  },
  {
    functional: true,
  }
);

export const resetPassword = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(ApiService),
    resetPasswordStore = inject(ResetPasswordStore),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(authActions.resetPassword),
      exhaustMap((request) => {
        resetPasswordStore.ResetPassword();
        return apiService.request(API.RESET_PASSWORD, request).pipe(
          map((response: any) => {
            resetPasswordStore.ResetPasswordSuccess(response);
            router.navigateByUrl(Routes.Auth.Login);
            return authActions.resetPasswordSuccess();
          }),
          catchError((error) => {
            resetPasswordStore.ResetPasswordFailure(error);
            return of(authActions.resetPasswordFailure());
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
  ) => {
    return actions$.pipe(
      ofType(authActions.logout),
      tap(() => {
        store.dispatch(authActions.resetState());
        store.dispatch(contactsActions.resetState());
        store.dispatch(channelsActions.resetState());
        store.dispatch(onlineFriendsActions.resetState());
        store.dispatch(userActions.resetState());
        localStorage.removeItem('isLoggedIn');
        router.navigateByUrl(Routes.Home);
      })
    );
  },
  {
    functional: true,
  }
);
