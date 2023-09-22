import { NgIf } from '@angular/common';
import {
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EmailStepComponent } from '../email-step/email-step.component';
import { Store } from '@ngrx/store';
import { selectQueryParams } from 'src/app/shared/router-store/router-selector';
import { TokenStepComponent } from './token-step/token-step.component';
import { ResetPasswordStore } from './store/reset-password.store';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    NgIf,
    RouterLink,
    EmailStepComponent,
    TokenStepComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private readonly store = inject(Store);
  private readonly resetPasswordStore = inject(ResetPasswordStore);
  readonly state = this.resetPasswordStore.instance;
  constructor() {
    // Router Store
    const param: Signal<Params> = this.store.selectSignal(selectQueryParams);
    if (param()['token'] && param()['token']) {
      this.resetPasswordStore.paramsState(JSON.parse(atob(param()['token'])));
      if(this.state().params?.token){
        this.resetPasswordStore.stepState(1);
        return;
      }
      this.resetPasswordStore.stepState(0);
    }
  }

  nextStep() {
    this.resetPasswordStore.stepState(1);
  }

  backStep() {
    this.resetPasswordStore.stepState(0);
  }

  clearParams() {
    this.resetPasswordStore.paramsState(null);
  }
}
