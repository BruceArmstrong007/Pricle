import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ContactCardComponent } from 'src/app/shared/components/contact-card/contact-card.component';
import { CardEvent } from 'src/app/shared/utils/types';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';

enum ReceivedRequestsCard {
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

@Component({
  selector: 'app-received-requests',
  standalone: true,
  imports: [NgFor, NgIf, ContactCardComponent, DividerModule],
  templateUrl: './received-requests.component.html',
  styleUrls: ['./received-requests.component.scss'],
})
export class ReceivedRequestsComponent implements OnDestroy{
  private readonly store = inject(Store);
  readonly contacts = this.store.selectSignal(
    contactsFeature.receivedRequestList
  );
  items = [
    {
      label: 'Accept Request',
      key: ReceivedRequestsCard.ACCEPT,
      icon: 'check',
    },
    {
      label: 'Decline Request',
      key: ReceivedRequestsCard.DECLINE,
      icon: 'close',
      backgroundColor: 'red',
    },
  ];
  private ref: DynamicDialogRef | undefined;
  dialogService = inject(DialogService);

  clickCard(event: CardEvent) {
    switch (event.type) {
      case ReceivedRequestsCard.ACCEPT:
        this.requestPopup(event.contactID, event.type);
        break;
      case ReceivedRequestsCard.DECLINE:
        this.requestPopup(event.contactID, event.type);
        break;
      default:
    }
  }

  requestPopup(contactID: string, key: ReceivedRequestsCard) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to ' + key + ' this request !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        if (key === ReceivedRequestsCard.ACCEPT) {
          this.store.dispatch(contactsActions.acceptRequest({ contactID }));
        }
        if (key === ReceivedRequestsCard.DECLINE) {
          this.store.dispatch(contactsActions.declineRequest({ contactID }));
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
