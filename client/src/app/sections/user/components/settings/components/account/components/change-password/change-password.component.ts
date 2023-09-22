import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CustomValidationService } from 'src/app/shared/services/validator/custom-validation.service';
import { ChangePasswordStore } from './store/change-password.store';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { userActions } from 'src/app/stores/user/user.action';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ButtonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly passwordValidator = inject(CustomValidationService);
  private readonly changePasswordStore = inject(ChangePasswordStore);
  readonly state = this.changePasswordStore.instance;
  readonly form: FormGroup;
  private ref: DynamicDialogRef | undefined;
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.form = this.fb.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^[A-Za-z][A-Za-z\d]*\d[A-Za-z\d]*$/),
          ]),
        ],
        confirmPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^[A-Za-z][A-Za-z\d]*\d[A-Za-z\d]*$/),
          ]),
        ],
      },
      {
        validators: (control: FormControl) =>
          this.passwordValidator.MatchValidator(
            control,
            'password',
            'confirmPassword'
          ),
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.changePassword();
  }

  changePassword() {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to change your password !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.store.dispatch(userActions.resetPassword(this.form.value));
        this.clear();
      }
    });
  }

  changePasswordVisibility() {
    this.changePasswordStore.passwordVisibilityState(
      !this.state().passwordVisibility
    );
  }

  changeConfirmPasswordVisibility() {
    console.log(this.state().confirmPasswordVisibility);

    this.changePasswordStore.confirmPasswordVisibilityState(
      !this.state().confirmPasswordVisibility
    );
  }

  clear() {
    this.form.reset();
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
}
