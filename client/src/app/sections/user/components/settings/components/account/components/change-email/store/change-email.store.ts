import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ChangeEmailState } from './types';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
@Injectable()
export class ChangeEmailStore extends ComponentStore<ChangeEmailState> {
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly isLinkLoading = this.selectSignal((s) => s.isLinkLoading);
  private readonly isLinkSent = this.selectSignal((s) => s.isLinkSent);
  private readonly error = this.selectSignal((s) => s.error);
  readonly instance = this.selectSignal(
    this.isLoading,
    this.isLinkLoading,
    this.isLinkSent,
    this.error,
    (isLoading, isLinkLoading, isLinkSent, error) => ({
      isLoading,
      isLinkSent,
      isLinkLoading,
      error,
    })
  );
  private readonly toastService = inject(MessageService);
  constructor() {
    super({
      isLinkLoading: false,
      isLinkSent: false,
      isLoading: false,
      error: null,
    });
  }

  loadingState = this.updater(
    (s: ChangeEmailState, isLoading: boolean): ChangeEmailState => ({
      ...s,
      isLoading,
    })
  );

  linkLoadingState = this.updater(
    (s: ChangeEmailState, isLinkLoading: boolean): ChangeEmailState => ({
      ...s,
      isLinkLoading,
    })
  );

  isLinkSentState = this.updater(
    (s: ChangeEmailState, isLinkSent: boolean): ChangeEmailState => ({
      ...s,
      isLinkSent,
    })
  );

  readonly ChangeEmailLink = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.linkLoadingState(true);
      })
    )
  );

  readonly ChangeEmailLinkSuccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((res: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success!',
          detail: res.message,
        });
        this.linkLoadingState(false);
        this.isLinkSentState(true);
      })
    )
  );

  readonly ChangeEmailLinkFailure = this.effect((trigger$) =>
    trigger$.pipe(
      tap((err: any) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        this.linkLoadingState(false);
      })
    )
  );

  readonly ChangeEmail = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly ChangeEmailSuccess = this.effect<void>((trigger$) =>
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

  readonly ChangeEmailFailure = this.effect((trigger$) =>
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
