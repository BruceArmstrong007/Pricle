import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ContactCardComponent } from 'src/app/shared/components/contact-card/contact-card.component';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { CardEvent } from 'src/app/shared/utils/types';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';

enum FriendsCard {
  REMOVE = 'remove',
  CHAT = 'chat',
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [NgFor, NgIf, ContactCardComponent, DividerModule],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  readonly contacts = this.store.selectSignal(contactsFeature.friendsList);
  items = [
    {
      label: 'Send Message',
      key: FriendsCard.CHAT,
      icon: 'chat_bubble',
    },
    {
      label: 'Remove Friend',
      key: FriendsCard.REMOVE,
      icon: 'remove',
      backgroundColor: 'red',
    },
  ];
  private ref: DynamicDialogRef | undefined;
  private readonly dialogService = inject(DialogService);
  readonly Routes: RoutesInterface = Routes;

  clickCard(event: CardEvent) {
    switch (event.type) {
      case FriendsCard.CHAT:
        this.router.navigateByUrl(
          Routes.User.Chats.Root + '/' + event.contactID
        );
        break;
      case FriendsCard.REMOVE:
        this.removeContactPopup(event.contactID);
        break;
      default:
    }
  }

  removeContactPopup(contactID: string) {
    this.ref = this.dialogService.open(ConfirmDialogComponent, {
      header: 'Confirmation',
      data: {
        content: 'You want to remove this contact !?',
      },
    });
    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.store.dispatch(contactsActions.removeContact({ contactID }));
      }
    });
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }

  trackBy(index: number, contact: ContactDetails): string {
    return contact._id;
  }
}
