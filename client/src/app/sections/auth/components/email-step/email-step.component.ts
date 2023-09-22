import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  inject,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { SectionType, VerificationData } from '../../types/types';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/stores/auth/auth.action';

@Component({
  selector: 'app-email-step',
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
  templateUrl: './email-step.component.html',
  styleUrls: ['./email-step.component.scss'],
})
export class EmailStepComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly form: FormGroup;
  @Input({
    required: true,
  })
  section!: string;
  @Input()
  props!: VerificationData;
  @Output() nextStep = new EventEmitter();
  @Output() clearParams = new EventEmitter();
  @Input({ required: true })
  isLoading!: boolean;

  constructor() {
    this.form = this.fb.group({
      email: [
        { value: '', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.maxLength(320),
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
          ),
        ]),
      ],
    });
  }

  ngOnInit(): void {
    if (!this.props) {
      return;
    }
    this.form.patchValue({
      email: this.props.email,
    });
    this.f['email'].disable();
  }

  get f() {
    return this.form.controls;
  }

  enableEmail() {
    this.f['email'].enable();
    this.f['email'].valueChanges.subscribe(() => {
      this.router.navigate([]);
      this.clearParams.emit();
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    if (this.section === SectionType.EMAIL) {
      this.store.dispatch(authActions.verifyEmailLink(this.form.getRawValue()));
    }
    if (this.section === SectionType.RESET_PASSWORD) {
      this.store.dispatch(authActions.resetPasswordLink(this.form.getRawValue()));
    }
  }

  clear() {
    this.form.reset();
  }

  next() {
    this.nextStep.emit();
  }

  resend() {
    this.submit();
  }
}
