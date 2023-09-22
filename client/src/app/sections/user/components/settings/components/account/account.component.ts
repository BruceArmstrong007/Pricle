import { Component, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { userActions } from 'src/app/stores/user/user.action';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ConfirmDialogComponent,
    DynamicDialogModule,
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  private ref: DynamicDialogRef | undefined;
  private readonly dialogService = inject(DialogService);
  private readonly store = inject(Store);

  deleteAccount() {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to delete your account !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.store.dispatch(userActions.deleteAccount());
      }
    });
  }
}
