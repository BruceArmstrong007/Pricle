import { ComponentStore } from '@ngrx/component-store';
import { Injectable, inject, Signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { EditProfileState } from './types';

@Injectable()
export class EditProfileStore extends ComponentStore<EditProfileState> {
  private readonly isLoading = this.selectSignal((s) => s.isLoading);
  private readonly error = this.selectSignal((s) => s.error);
  private readonly toastService = inject(MessageService);

  readonly instance: Signal<EditProfileState> = this.selectSignal(
    this.isLoading,
    this.error,
    (isLoading, error) => ({
      isLoading,
      error,
    })
  );

  constructor() {
    super({
      isLoading: false,
      error: null,
    });
  }

  loadingState = this.updater(
    (s: EditProfileState, isLoading: boolean): EditProfileState => ({
      ...s,
      isLoading,
    })
  );

  readonly EditProfile = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.loadingState(true);
      })
    )
  );

  readonly EditProfileSuccess = this.effect<void>((trigger$) =>
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

  readonly EditProfileFailure = this.effect((trigger$) =>
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
