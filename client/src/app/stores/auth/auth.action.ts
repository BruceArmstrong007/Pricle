import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Login,
  LoginSuccess,
  RefreshToken,
  Register,
  ResetPassword,
  ResetPasswordLink,
  VerifyEmail,
  VerifyEmailLink,
} from './auth.model';

export const authActions = createActionGroup({
  source: 'Auth Actions',
  events: {
    Login: props<{ request: Login }>(),
    LoginSuccess: props<LoginSuccess>(),
    LoginFailure: emptyProps(),
    Register: props<{ request: Register }>(),
    RegisterSuccess: emptyProps(),
    RegisterFailure: emptyProps(),
    RefreshToken: props<RefreshToken>(),
    VerifyEmailLink: props<{ request: VerifyEmailLink }>(),
    VerifyEmailLinkSuccess: emptyProps(),
    VerifyEmailLinkFailure: emptyProps(),
    VerifyEmail: props<{ request: VerifyEmail }>(),
    VerifyEmailSuccess: emptyProps(),
    VerifyEmailFailure: emptyProps(),
    ResetPasswordLink: props<{ request: ResetPasswordLink }>(),
    ResetPasswordLinkSuccess: emptyProps(),
    ResetPasswordLinkFailure: emptyProps(),
    ResetPassword: props<{ request: ResetPassword }>(),
    ResetPasswordSuccess: emptyProps(),
    ResetPasswordFailure: emptyProps(),
    Logout: emptyProps(),

    ResetState: emptyProps(),
  },
});
