import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.model';
import { authActions } from './auth.action';

const initialState: AuthState = {
  isLoading: false,
  accessToken: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      authActions.refreshToken,
      (state, action): AuthState => ({
        ...state,
        accessToken: action.accessToken,
      })
    ),
    on(
      authActions.login,
      authActions.register,
      authActions.resetPassword,
      authActions.resetPasswordLink,
      authActions.verifyEmail,
      authActions.verifyEmailLink,
      (state): AuthState => ({ ...state, isLoading: true })
    ),
    on(
      authActions.loginFailure,
      authActions.registerSuccess,
      authActions.registerFailure,
      authActions.resetPasswordSuccess,
      authActions.resetPasswordFailure,
      authActions.verifyEmailSuccess,
      authActions.verifyEmailFailure,
      authActions.resetPasswordLinkSuccess,
      authActions.resetPasswordLinkFailure,
      authActions.verifyEmailLinkSuccess,
      authActions.verifyEmailLinkFailure,
      (state): AuthState => ({ ...state, isLoading: true })
    ),
    on(
      authActions.loginSuccess,
      (state, action): AuthState => ({
        ...state,
        isLoading: false,
        accessToken: action.accessToken,
      })
    ),
    on(
      authActions.resetState,
      (state): AuthState => ({
        ...state,
        ...initialState,
      })
    )
  ),
});
