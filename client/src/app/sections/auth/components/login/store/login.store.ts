import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { Injectable, Signal, inject } from '@angular/core';
import { LoginState } from './types';
import { MessageService } from 'primeng/api';

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly error = this.selectSignal((s) => s.error);
  private readonly passwordVisibility = this.selectSignal(
    (s) => s.passwordVisibility
  );
  private readonly toastService = inject(MessageService);
  readonly instance: Signal<LoginState> = this.selectSignal(
    this.isLoading,
    this.error,
    this.passwordVisibility,
    (isLoading, error, passwordVisibility) => ({
      error,
      isLoading,
      passwordVisibility,
    })
  );

  constructor() {
    super({
      isLoading: false,
      error: null,
      passwordVisibility: false,
    });
  }

  passwordVisibilityState = this.updater(
    (s: LoginState, value: boolean): LoginState => ({
      ...s,
      passwordVisibility: value,
    })
  );

  loadingState = this.updater(
    (s: LoginState, isLoading: boolean): LoginState => ({
      ...s,
      isLoading,
    })
  );

  readonly Login = this.effect<void>((trigger$) =>
    trigger$.pipe(tap(() => this.loadingState(true)))
  );

  readonly LoginSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.toastService.add({
          severity: 'success',
          summary: 'Welcome!',
          detail: 'You are loggedin!',
        });
        this.loadingState(false);
      })
    )
  );

  readonly LoginFailure = this.effect<void>((trigger$) =>
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
