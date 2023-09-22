import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { LoginStore } from './store/login.store';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/stores/auth/auth.action';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [],
})
export class LoginComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly loginStore = inject(LoginStore);
  private readonly store = inject(Store);
  readonly state = this.loginStore.instance;
  readonly form: FormGroup;
  readonly Routes: RoutesInterface = Routes;

  constructor() {
    this.form = this.fb.group({
      username: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(25)]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[A-Za-z][A-Za-z\d]*\d[A-Za-z\d]*$/),
        ]),
      ],
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(authActions.login(this.form.value));
  }

  changeVisibility() {
    this.loginStore.passwordVisibilityState(!this.state().passwordVisibility);
  }

  clear() {
    this.form.reset();
  }

  preventDefault(event: Event){
    event.preventDefault();
  }
}
