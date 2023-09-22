import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { VerifyAccountState } from './types';
import { VerificationData } from '../../../types/types';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

const initialState: VerifyAccountState = {
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
};

@Injectable()
export class VerifyAccountStore extends ComponentStore<VerifyAccountState> {
  private isLoading = this.selectSignal((s) => s.isLoading);
  private error = this.selectSignal((s) => s.error);
  private step = this.selectSignal((s) => s.step);
  private items = this.selectSignal((s) => s.items);
  private params = this.selectSignal((s) => s.params);
  private readonly toastService = inject(MessageService);
  readonly instance = this.selectSignal(
    this.isLoading,
    this.error,
    this.step,
    this.items,
    this.params,
    (isLoading, error, step, items, params) => ({
      isLoading,
      error,
      step,
      items,
      params,
    })
  );

  constructor() {
    super(initialState);
  }

  loadingState = this.updater(
    (s: VerifyAccountState, isLoading: boolean): VerifyAccountState => ({
      ...s,
      isLoading,
    })
  );

  stepState = this.updater(
    (s: VerifyAccountState, step: number): VerifyAccountState => ({
      ...s,
      step,
    })
  );

  paramsState = this.updater(
    (
      s: VerifyAccountState,
      params: VerificationData | null
    ): VerifyAccountState => ({
      ...s,
      params,
    })
  );

  resetState = this.updater(
    (): VerifyAccountState => ({
      ...initialState,
    })
  );

  readonly VerifyAccountLink = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly VerifyAccountLinkSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.response.message,
        });
        this.stepState(1);
        this.paramsState({ email: res.request.email, token: '' });
        this.loadingState(false);
      })
    )
  );

  readonly VerifyAccountLinkFailure = this.effect<void>((trigger$) =>
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

  readonly VerifyAccount = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly VerifyAccountSuccess = this.effect<void>((trigger$) =>
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

  readonly VerifyAccountFailure = this.effect<void>((trigger$) =>
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
