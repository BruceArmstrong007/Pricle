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
  readonly form: FormGroup;
  @Input() props!: VerificationData;
  @Output() backStep = new EventEmitter();
  @Input({ required: true })
  isLoading!: boolean;

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
      token: ['', Validators.compose([Validators.required])],
    });
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
    this.store.dispatch(authActions.verifyEmail(this.form.getRawValue()));
  }

  back() {
    this.backStep.emit();
  }
}
