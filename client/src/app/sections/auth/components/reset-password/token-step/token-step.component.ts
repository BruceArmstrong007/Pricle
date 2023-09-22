import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  inject,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
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
import { StepsModule } from 'primeng/steps';
import { VerificationData } from '../../../types/types';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/stores/auth/auth.action';
import { CustomValidationService } from 'src/app/shared/services/validator/custom-validation.service';
import { ResetPasswordStore } from '../store/reset-password.store';

@Component({
  selector: 'app-token-step',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    StepsModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './token-step.component.html',
  styleUrls: ['./token-step.component.scss'],
})
export class TokenStepComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly passwordValidator = inject(CustomValidationService);
  private readonly resetPasswordStore = inject(ResetPasswordStore);
  readonly state =  this.resetPasswordStore.instance;
  readonly form: FormGroup;
  @Input() props!: VerificationData;
  @Output() backStep = new EventEmitter();

  constructor() {
    this.form = this.fb.group(
      {
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
        token: ['', Validators.compose([Validators.required])],
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

  ngOnInit(): void {
    if (!this.props) {
      return;
    }
    this.form.patchValue({
      email: this.props.email,
      token: this.props.token,
    });
    this.f['email'].disable();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(authActions.resetPassword(this.form.getRawValue()));
  }


  changePasswordVisibility(){
    this.resetPasswordStore.passwordVisibilityState(!this.state().passwordVisibility);
  }

  changeConfirmPasswordVisibility(){
    this.resetPasswordStore.confirmPasswordVisibilityState(!this.state().confirmPasswordVisibility);
  }

  back() {
    this.backStep.emit();
  }

  preventDefault(event: Event){
    event.preventDefault();
  }
}
