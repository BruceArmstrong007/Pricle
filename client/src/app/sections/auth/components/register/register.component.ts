import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CustomValidationService } from 'src/app/shared/services/validator/custom-validation.service';
import { RegisterStore } from './store/register.store';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/stores/auth/auth.action';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly passwordValidator = inject(CustomValidationService);
  private readonly registerStore = inject(RegisterStore);
  readonly state = this.registerStore.instance;
  readonly form: FormGroup;
  readonly Routes: RoutesInterface = Routes;

  constructor() {
    this.form = this.fb.group(
      {
        username: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(25)]),
        ],
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
    this.store.dispatch(authActions.register(this.form.value));
  }

  changePasswordVisibility(){
    this.registerStore.passwordVisibilityState(!this.state().passwordVisibility);
  }

  changeConfirmPasswordVisibility(){
    this.registerStore.confirmPasswordVisibilityState(!this.state().confirmPasswordVisibility);
  }

  clear() {
    this.form.reset();
  }

  preventDefault(event: Event){
    event.preventDefault();
  }

}
