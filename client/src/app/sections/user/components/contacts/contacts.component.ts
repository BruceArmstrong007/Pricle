import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { selectUrl } from 'src/app/shared/router-store/router-selector';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { NgIf } from '@angular/common';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { ContactStatus, ContactType } from 'src/app/shared/utils/variables';
import { OnlineFriendsComponent } from './components/online-friends/online-friends.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    ButtonModule,
    RouterLink,
    ToastModule,
    LoaderComponent,
    NgIf,
    OnlineFriendsComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  private readonly store = inject(Store);
  readonly url = this.store.selectSignal(selectUrl);
  isLoading = this.store.selectSignal(contactsFeature.selectIsLoading);
  private readonly friendsList = this.store.selectSignal(
    contactsFeature.friendsList
  );
  private readonly receivedRequestList = this.store.selectSignal(
    contactsFeature.receivedRequestList
  );
  readonly acceptedCount = this.store.selectSignal(
    contactsFeature.acceptedCount
  );
  readonly receivedCount = this.store.selectSignal(
    contactsFeature.receivedCount
  );
  Routes: RoutesInterface = Routes;

  friends() {
    this.friendsList().forEach((friend: ContactDetails) => {
      if (friend.status === ContactStatus.ACCEPTED && friend?.type === ContactType.RECEIVER) {
        const request = {
          contactID: friend?._id,
          type: friend?.type,
          status: friend?.status,
        };
        this.store.dispatch(contactsActions.seenContact({ request }));
      }
    });
  }

  receivedRequests() {
    this.receivedRequestList().forEach((contact: ContactDetails) => {
      if (contact.status === ContactStatus.SENT && contact?.type === ContactType.SENDER) {
        const request = {
          contactID: contact?._id,
          type: contact?.type,
          status: contact?.status,
        };
        this.store.dispatch(contactsActions.seenContact({ request }));
      }
    });
  }
}
