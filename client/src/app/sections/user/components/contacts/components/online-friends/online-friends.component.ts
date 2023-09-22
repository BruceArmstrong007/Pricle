import { NgFor, NgIf } from '@angular/common';
import { Component, Signal, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DividerModule } from 'primeng/divider';
import { ContactCardComponent } from 'src/app/shared/components/contact-card/contact-card.component';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { onlineFriendsFeature } from 'src/app/stores/online-friends/online-friends.reducer';

@Component({
  selector: 'app-online-friends',
  standalone: true,
  imports: [ContactCardComponent, DividerModule, NgFor, NgIf],
  templateUrl: './online-friends.component.html',
  styleUrls: ['./online-friends.component.scss'],
})
export class OnlineFriendsComponent {
  private readonly store = inject(Store);
  private readonly friends = this.store.selectSignal(
    contactsFeature.selectEntities
  );
  private readonly onlineFriends = this.store.selectSignal(
    onlineFriendsFeature.selectAll
  );
  readonly contacts!: Signal<any[] | undefined>;

  constructor() {
    this.contacts = computed(() => {
      const friends = this.friends();
      const isOnline = this.onlineFriends()?.filter((online) => online?.isOnline);
      const online = isOnline.map((contact) => friends[contact?.id])
      return online ?? [];
    });
  }

  trackBy(index: number, contact: ContactDetails): string {
    return contact._id;
  }
}
