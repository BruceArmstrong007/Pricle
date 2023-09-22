import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ChangePasswordState } from './types';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class ChangePasswordStore extends ComponentStore<ChangePasswordState> {
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly error = this.selectSignal((s) => s.error);
  private readonly passwordVisibility = this.selectSignal(
    (s) => s.passwordVisibility
  );
  private readonly confirmPasswordVisibility = this.selectSignal(
    (s) => s.confirmPasswordVisibility
  );
  readonly instance = this.selectSignal(
    this.isLoading,
    this.error,
    this.passwordVisibility,
    this.confirmPasswordVisibility,
    (isLoading, error, passwordVisibility, confirmPasswordVisibility) => ({
      isLoading,
      error,
      passwordVisibility,
      confirmPasswordVisibility,
    })
  );
  private readonly toastService = inject(MessageService);

  constructor() {
    super({
      isLoading: false,
      error: null,
      passwordVisibility: false,
      confirmPasswordVisibility: false,
    });
  }

  passwordVisibilityState = this.updater(
    (s: ChangePasswordState, value: boolean): ChangePasswordState => ({
      ...s,
      passwordVisibility: value,
    })
  );

  confirmPasswordVisibilityState = this.updater(
    (s: ChangePasswordState, value: boolean): ChangePasswordState => ({
      ...s,
      confirmPasswordVisibility: value,
    })
  );

  loadingState = this.updater(
    (s: ChangePasswordState, isLoading: boolean): ChangePasswordState => ({
      ...s,
      isLoading,
    })
  );

  readonly ChangePassword = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly ChangePasswordSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success!',
          detail: res.message,
        });
        this.loadingState(false);
      })
    )
  );

  readonly ChangePasswordFailure = this.effect((trigger$) =>
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
