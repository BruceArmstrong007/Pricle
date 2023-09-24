import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ChangeEmail,
  ChangeEmailLink,
  ResetPassword,
  UploadProfile,
  UserDetails,
} from './user.model';

export const userActions = createActionGroup({
  source: 'User Actions',
  events: {
    Profile: emptyProps(),
    ProfileSuccess: props<UserDetails>(),
    ProfileFailure: emptyProps(),
    Logout: emptyProps(),
    LogoutSuccess: emptyProps(),
    LogoutFailure: emptyProps(),

    UpdateUser: props<{
      request: Pick<UserDetails, 'name' & 'bio' & 'userame'>;
    }>(),
    UpdateUserSuccess: emptyProps(),
    UpdateUserFailure: emptyProps(),

    UploadProfile: props<UploadProfile>(),
    UploadProfileSuccess: emptyProps(),
    UploadProfileFailure: emptyProps(),

    ResetPassword: props<ResetPassword>(),
    ResetPasswordSuccess: emptyProps(),
    ResetPasswordFailure: emptyProps(),

    DeleteAccount: emptyProps(),
    DeleteAccountSuccess: emptyProps(),
    DeleteAccountFailure: emptyProps(),

    ChangeEmailLink: props<ChangeEmailLink>(),
    ChangeEmailLinkSuccess: emptyProps(),
    ChangeEmailLinkFailure: emptyProps(),

    ChangeEmail: props<ChangeEmail>(),
    ChangeEmailSuccess: emptyProps(),
    ChangeEmailFailure: emptyProps(),

    ResetState: emptyProps(),
  },
});
