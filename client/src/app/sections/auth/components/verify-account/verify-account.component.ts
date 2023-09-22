import { NgIf } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Params } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { TokenStepComponent } from './token-step/token-step.component';
import { EmailStepComponent } from '../email-step/email-step.component';
import { Store } from '@ngrx/store';
import { selectQueryParams } from 'src/app/shared/router-store/router-selector';
import { VerifyAccountStore } from './store/verify-account.store';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    StepsModule,
    NgIf,
    TokenStepComponent,
    EmailStepComponent,
  ],
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent {
  private readonly store = inject(Store);
  private readonly verfiyAccountStore = inject(VerifyAccountStore);
  readonly state = this.verfiyAccountStore.instance;

  constructor() {
    // router Store selection
    const param: Signal<Params> = this.store.selectSignal(selectQueryParams);
    if (param()['token'] && param()['token']) {
      this.verfiyAccountStore.paramsState(JSON.parse(atob(param()['token'])));
      this.verfiyAccountStore.stepState(1);
    }
  }

  nextStep() {
    this.verfiyAccountStore.stepState(1);
  }

  backStep() {
    this.verfiyAccountStore.stepState(0);
  }

  clearParams() {
    this.verfiyAccountStore.paramsState(null);
  }
}
