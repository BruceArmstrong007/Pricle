import { Component, OnDestroy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ContactCardComponent } from 'src/app/shared/components/contact-card/contact-card.component';
import { Store } from '@ngrx/store';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CardEvent } from 'src/app/shared/utils/types';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { DividerModule } from 'primeng/divider';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';

enum SentRequestsCard {
  SEND = 'Send',
  CANCEL = 'cancel',
}

@Component({
  selector: 'app-sent-requests',
  standalone: true,
  imports: [NgFor, NgIf, ContactCardComponent, DividerModule],
  templateUrl: './sent-requests.component.html',
  styleUrls: ['./sent-requests.component.scss'],
})
export class SentRequestsComponent implements OnDestroy {
  private readonly store = inject(Store);
  readonly contacts = this.store.selectSignal(contactsFeature.sentRequestList);
  items = [
    {
      label: 'Cancel Request',
      key: SentRequestsCard.CANCEL,
      icon: 'cancel',
      backgroundColor: 'red',
    },
  ];
  private ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);

  clickCard(event: CardEvent) {
    switch (event.type) {
      case SentRequestsCard.CANCEL:
        this.requestPopup(event.contactID, event.type);
        break;
      default:
    }
  }

  requestPopup(contactID: string, key: SentRequestsCard) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to ' + key + ' this request !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (key === SentRequestsCard.SEND) {
          this.store.dispatch(contactsActions.sendRequest({ contactID }));
        }
        if (key === SentRequestsCard.CANCEL) {
          this.store.dispatch(contactsActions.cancelRequest({ contactID }));
        }
      }
    });
  }

  trackBy(index: number, contact: ContactDetails): string {
    return contact._id;
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }
}
