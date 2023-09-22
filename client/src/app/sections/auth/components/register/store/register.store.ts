import { ComponentStore } from '@ngrx/component-store';
import { Signal, inject, Injectable } from '@angular/core';
import { RegisterState } from './type';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> {
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly error = this.selectSignal((s) => s.error);
  private readonly passwordVisibility = this.selectSignal(
    (s) => s.passwordVisibility
  );
    private readonly confirmPasswordVisibility = this.selectSignal(
    (s) => s.confirmPasswordVisibility
  );
  private readonly toastService = inject(MessageService);

  readonly instance: Signal<RegisterState> = this.selectSignal(
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

  constructor() {
    super({
      isLoading: false,
      error: null,
      passwordVisibility: false,
      confirmPasswordVisibility: false,
    });
  }

  passwordVisibilityState = this.updater(
    (s: RegisterState, value: boolean): RegisterState => ({
      ...s,
      passwordVisibility: value,
    })
  );

  confirmPasswordVisibilityState = this.updater(
    (s: RegisterState, value: boolean): RegisterState => ({
      ...s,
      confirmPasswordVisibility: value,
    })
  );

  loadingState = this.updater(
    (s: RegisterState, isLoading: boolean): RegisterState => ({
      ...s,
      isLoading,
    })
  );

  readonly Register = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly RegisterSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'We welcome you to pricle!',
          detail: res.message,
        });
        this.loadingState(false);
      })
    )
  );

  readonly RegisterFailure = this.effect((trigger$) =>
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
