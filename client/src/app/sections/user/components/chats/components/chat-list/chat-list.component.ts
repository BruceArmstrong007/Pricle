import {
  Component,
  inject,
  WritableSignal,
  signal,
  Signal,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import {
  ChatCardComponent,
  Message,
} from './components/chat-card/chat-card.component';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Routes, RoutesInterface } from 'src/app/shared/utils/client.routes';
import { selectUrl } from 'src/app/shared/router-store/router-selector';
import { DividerModule } from 'primeng/divider';
import { onlineFriendsFeature } from 'src/app/stores/online-friends/online-friends.reducer';
import { channelsFeature } from 'src/app/stores/channels/channels.reducer';
import { userFeature } from 'src/app/stores/user/user.reducer';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    ChatCardComponent,
    NgFor,
    InputTextModule,
    RouterLink,
    DividerModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
  private readonly store = inject(Store);
  readonly url = this.store.selectSignal(selectUrl);
  private readonly router = inject(Router);
  private readonly user = this.store.selectSignal(userFeature.selectDetails);
  private readonly friends = this.store.selectSignal(
    contactsFeature.friendsList
  );
  private readonly rooms = this.store.selectSignal(
    channelsFeature.selectEntities
  );
  private readonly onlineFriends = this.store.selectSignal(
    onlineFriendsFeature.selectEntities
  );
  readonly totalDelivered = this.store.selectSignal(
    channelsFeature.totalDeliveredStatus
  );
  readonly contacts: Signal<ContactDetails[]>;
  search: WritableSignal<string> = signal('');
  readonly Routes: RoutesInterface = Routes;

  constructor() {
    this.contacts = computed(() => {
      const friends = this.friends();
      const search = this.search();
      if (search == '') {
        return friends;
      }
      return friends.filter((contact) =>
        contact.name?.toLowerCase()?.includes(search)
      );
    });
  }

  selectChat(contactID: string) {
    this.router.navigateByUrl('/user/chats/' + contactID);
  }

  typing(event: any) {
    this.search.set(event?.target?.value ?? '');
  }

  trackBy(index: number, contact: ContactDetails): string {
    return contact._id;
  }

  isOnline(contactID: any): boolean {
    return this.onlineFriends()[contactID]?.isOnline ? true : false;
  }

  messageEvent(
    contactID: string | undefined,
    contactName: string | undefined
  ): Message | undefined {
    if (!contactID) return undefined;
    const roomID = this.generateRoomIDs(contactID, this.user()?._id);
    const room = this.rooms()[roomID];
    const contactTyping = room?.typing?.find(
      (res) => res.senderID === contactID
    );
    if (contactTyping) {
      return {
        type: 'chat',
        content: 'is typing...',
        author: contactName ?? '',
      };
    }
    const roomMessage = room?.messages[room?.messages.length - 1];
    if (roomMessage) {
      let who = 'You';
      if (this.user()?._id !== roomMessage?.senderID) who = contactName ?? '';
      return {
        type: 'chat',
        content: roomMessage?.content,
        author: who ?? '',
      };
    }
    return undefined;
  }

  deliveredStatus(contactID: string | undefined) {
    if (!contactID || !this.user()?._id) return undefined;
    const roomID = this.generateRoomIDs(contactID, this.user()?._id);
    const room = this.totalDelivered()?.find((res) => roomID === res?.roomID);
    return room?.count ?? 0;
  }

  generateRoomIDs(id1: any, id2: any): string {
    return [id1, id2].sort().join('-');
  }
}
