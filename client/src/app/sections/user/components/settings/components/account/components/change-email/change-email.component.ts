import { Component, Signal, inject, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChangeEmailStore } from './store/change-email.store';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { userActions } from 'src/app/stores/user/user.action';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { Params } from '@angular/router';
import { selectQueryParams } from 'src/app/shared/router-store/router-selector';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [ButtonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly changeEmailStore = inject(ChangeEmailStore);
  readonly state = this.changeEmailStore.instance;
  readonly form: FormGroup;
  private ref: DynamicDialogRef | undefined;
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.form = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(320),
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
          ),
        ]),
      ],
      token: [
        { value: '', disabled: true },
        Validators.compose([Validators.required]),
      ],
    });
    const param: Signal<Params> = this.store.selectSignal(selectQueryParams);
    if (param()['token'] && param()['token']) {
      const decoded = JSON.parse(atob(param()['token']));
      if (decoded?.token) {
        this.form.patchValue({ decoded });
      }
    }

    effect(() => {
      const state = this.state();
      if (state?.isLinkSent) {
        this.f['token'].enable();
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.changeEmail();
  }

  changeEmail() {
    this.store.dispatch(userActions.changeEmail(this.form.value));
    this.clear();
  }

  sendVerificationLink() {
    const email = this.form.value?.email;
    if (!email) return;
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to change your email !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.store.dispatch(userActions.changeEmailLink({ email }));
      }
    });
  }

  clear() {
    this.form.reset();
  }
}
