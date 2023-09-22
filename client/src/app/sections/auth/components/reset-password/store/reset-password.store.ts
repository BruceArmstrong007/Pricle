import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ResetPasswordState } from './types';
import { VerificationData } from '../../../types/types';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

const initialState: ResetPasswordState = {
  isLoading: false,
  error: null,
  step: 0,
  items: [
    {
      label: 'Verify Email',
    },
    {
      label: 'OTP',
    },
  ],
  params: null,
  passwordVisibility: false,
  confirmPasswordVisibility: false,
};

@Injectable()
export class ResetPasswordStore extends ComponentStore<ResetPasswordState> {
  private isLoading = this.selectSignal((s) => s.isLoading);
  private error = this.selectSignal((s) => s.error);
  private step = this.selectSignal((s) => s.step);
  private items = this.selectSignal((s) => s.items);
  private params = this.selectSignal((s) => s.params);
  private readonly passwordVisibility = this.selectSignal(
    (s) => s.passwordVisibility
  );
  private readonly confirmPasswordVisibility = this.selectSignal(
    (s) => s.confirmPasswordVisibility
  );
  private toastService = inject(MessageService);
  readonly instance = this.selectSignal(
    this.isLoading,
    this.error,
    this.step,
    this.items,
    this.params,
    this.passwordVisibility,
    this.confirmPasswordVisibility,
    (
      isLoading,
      error,
      step,
      items,
      params,
      passwordVisibility,
      confirmPasswordVisibility
    ) => ({
      isLoading,
      error,
      step,
      items,
      params,
      passwordVisibility,
      confirmPasswordVisibility,
    })
  );

  constructor() {
    super(initialState);
  }

  passwordVisibilityState = this.updater(
    (s: ResetPasswordState, value: boolean): ResetPasswordState => ({
      ...s,
      passwordVisibility: value,
    })
  );

  confirmPasswordVisibilityState = this.updater(
    (s: ResetPasswordState, value: boolean): ResetPasswordState => ({
      ...s,
      confirmPasswordVisibility: value,
    })
  );

  loadingState = this.updater(
    (s: ResetPasswordState, isLoading: boolean): ResetPasswordState => ({
      ...s,
      isLoading,
    })
  );

  stepState = this.updater(
    (s: ResetPasswordState, step: number): ResetPasswordState => ({
      ...s,
      step,
    })
  );

  paramsState = this.updater(
    (
      s: ResetPasswordState,
      params: VerificationData | null
    ): ResetPasswordState => ({
      ...s,
      params,
    })
  );

  resetState = this.updater(
    (): ResetPasswordState => ({
      ...initialState,
    })
  );

  readonly ResetPasswordLink = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly ResetPasswordLinkSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.loadingState(false);
      })
    )
  );

  readonly ResetPasswordLinkFailure = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((err: any) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        this.loadingState(false);
      })
    )
  );

  readonly ResetPassword = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly ResetPasswordSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.resetState();
      })
    )
  );

  readonly ResetPasswordFailure = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((err: any) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        this.loadingState(false);
      })
    )
  );
}
