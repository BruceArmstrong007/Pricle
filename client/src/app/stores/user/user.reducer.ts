import { createFeature, createReducer, on } from '@ngrx/store';
import { UserState } from './user.model';
import { userActions } from './user.action';

const initialState: UserState = {
  details: null,
  isLoading: false,
};

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(
      userActions.profile,
      userActions.updateUser,
      userActions.uploadProfile,
      userActions.resetPassword,
      userActions.changeEmailLink,
      userActions.changeEmail,
      (state): UserState => ({ ...state, isLoading: true })
    ),
    on(
      userActions.profileSuccess,
      (state, action): UserState => ({
        ...state,
        details: action,
        isLoading: false,
      })
    ),
    on(
      userActions.profileFailure,
      userActions.updateUserFailure,
      userActions.updateUserSuccess,
      userActions.uploadProfileSuccess,
      userActions.uploadProfileFailure,
      userActions.updateUserFailure,
      userActions.deleteAccountSuccess,
      userActions.deleteAccountFailure,
      userActions.resetPasswordSuccess,
      userActions.resetPasswordFailure,
      userActions.changeEmailLinkFailure,
      userActions.changeEmailLinkSuccess,
      userActions.changeEmailFailure,
      userActions.changeEmailSuccess,
      (state): UserState => ({ ...state, isLoading: false })
    ),
    on(
      userActions.resetState,
      (state): UserState => ({
        ...state,
        ...initialState,
      })
    )
  ),
});
