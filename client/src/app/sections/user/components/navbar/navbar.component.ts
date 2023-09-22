import { Component, OnDestroy, inject, computed, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AutoFocusModule } from 'primeng/autofocus';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { selectUrl } from 'src/app/shared/router-store/router-selector';
import { userActions } from 'src/app/stores/user/user.action';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { NgIf } from '@angular/common';
import { channelsFeature } from 'src/app/stores/channels/channels.reducer';
import { AvatarModule } from 'primeng/avatar';
import { App } from '../../../../shared/utils/app.const';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    AutoFocusModule,
    DynamicDialogModule,
    RouterLink,
    AvatarComponent,
    NgIf,
    AvatarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  readonly AppIcon = App.ICON;
  private ref: DynamicDialogRef | undefined;
  private readonly store = inject(Store);
  readonly currentRoute = this.store.selectSignal(selectUrl);
  readonly user = this.store.selectSignal(userFeature.selectDetails);
  readonly Routes: RoutesInterface = Routes;
  private readonly acceptedCount = this.store.selectSignal(
    contactsFeature.acceptedCount
  );
  private readonly receivedCount = this.store.selectSignal(
    contactsFeature.receivedCount
  );
  private readonly deliveredMsgs = this.store.selectSignal(
    channelsFeature.totalDeliveredStatus
  );
  readonly deliveredCount!: Signal<number>;
  readonly totalCount!: Signal<number>;
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.totalCount = computed(() => {
      const accepted = this.acceptedCount();
      const received = this.receivedCount();
      return accepted + received;
    });
    this.deliveredCount = computed(() => {
      const count = this.deliveredMsgs()
        ?.flatMap((msgs) => msgs.count)
        ?.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);

      return count ?? undefined;
    });
  }

  show() {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to logout !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.store.dispatch(userActions.logout());
      }
    });
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }
}
