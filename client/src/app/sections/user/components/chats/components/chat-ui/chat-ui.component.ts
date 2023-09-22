import {
  Component,
  WritableSignal,
  signal,
  inject,
  Signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessagesComponent } from './components/messages/messages.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { Store } from '@ngrx/store';
import { selectParams } from 'src/app/shared/router-store/router-selector';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { onlineFriendsFeature } from 'src/app/stores/online-friends/online-friends.reducer';
import { MessageSocketService } from 'src/app/shared/sockets/message-socket/message-socket.service';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { Channel, MessageState } from 'src/app/stores/channels/channels.model';
import { channelsFeature } from 'src/app/stores/channels/channels.reducer';
import { MessageStatus } from 'src/app/shared/utils/variables';
import { Router } from '@angular/router';
import { Routes } from 'src/app/shared/utils/client.routes';
import { filter, debounceTime } from 'rxjs';
@Component({
  selector: 'app-chat-ui',
  standalone: true,
  imports: [
    ButtonModule,
    MessagesComponent,
    ChatHeaderComponent,
    OverlayPanelModule,
    PickerComponent,
  ],
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.scss'],
})
export class ChatUiComponent {
  private readonly store = inject(Store);
  readonly urlParams = this.store.selectSignal(selectParams);
  readonly contacts = this.store.selectSignal(contactsFeature.selectEntities);
  readonly contactRedirect = this.store.select(contactsFeature.selectEntities);
  readonly user = this.store.selectSignal(userFeature.selectDetails);
  private readonly rooms = this.store.selectSignal(
    channelsFeature.selectEntities
  );
  readonly chat: WritableSignal<string> = signal('');
  private readonly onlineFriends = this.store.selectSignal(
    onlineFriendsFeature.selectEntities
  );
  private readonly messageSocket = inject(MessageSocketService);
  readonly contact!: Signal<ContactDetails | undefined>;
  private readonly room!: Signal<Channel | undefined>;
  private readonly router = inject(Router);
  readonly messages!: Signal<any>;
  readonly typing!: Signal<any>;
  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor() {
    this.contact = computed(() => {
      const urlParams = this.urlParams()['id'];
      return this.contacts()[urlParams] as ContactDetails;
    });
    this.room = computed(() => {
      const userID = this.user()?._id;
      if (userID) {
        return this.rooms()[
          this.generateRoomIDs(this.urlParams()['id'], userID)
        ];
      }
      return undefined;
    });

    this.messages = computed(() => {
      const room = this.room();
      return room?.messages ?? [];
    });

    this.typing = computed(() => {
      const contactTyping = this.room()?.typing?.find(
        (res: MessageState) => res?.senderID === this.contact()?._id
      );
      if (contactTyping) {
        return {
          content: 'is typing...',
          author: this.contact()?.name ?? '',
        };
      }
      return undefined;
    });

    effect(() => {
      const contactID = this.contact()?._id;
      if (!this.user()?._id || !contactID) return;
      const roomID = this.generateRoomIDs(this.user()?._id, contactID);
      const deliveredIDs = this.messages()
        ?.filter(
          (res: MessageState) =>
            res?.status === MessageStatus.DELIVERED &&
            res?.senderID !== this.user()?._id
        )
        ?.flatMap((res: MessageState) => res?.messageID);
      if (deliveredIDs && deliveredIDs.length > 0) {
        const room = {
          roomID: roomID,
          messageID: deliveredIDs,
        };
      this.messageSocket.seenMessages(room);
      }
      setTimeout(() => this.scrollToBottom(), 300);
    });

    this.contactRedirect.pipe(debounceTime(1000)).subscribe((contacts) => {
      const contact = contacts[this.urlParams()['id']];
      if (!contact) this.router.navigate([Routes.User.Chats.Root]);
    });
  }

  scrollToBottom(): void {
    this.content.nativeElement.scrollTop =
      this.content.nativeElement.scrollHeight;
  }

  generateRoomIDs(id1: any, id2: any): string {
    return [id1, id2].sort().join('-');
  }

  sendMessage() {
    if (!this.chat()) return;
    this.messageSocket.sendMessages({
      senderID: this.user()?._id,
      receiverID: this.contact()?._id,
      timestamp: new Date().toISOString(),
      content: this.chat(),
      status: MessageStatus.SENT,
      type: 'chat',
    });
    this.clearChat();
  }

  addEmoji(event: any) {
    const emoji = event?.emoji?.native;
    if (emoji) this.chat.update((message) => message + emoji);
  }

  typingEvent(event: any) {
    this.chat.set(event?.target?.value ?? '');
  }

  clearChat() {
    this.chat.set('');
  }

  isOnline(contactID: string | undefined): boolean {
    if (contactID)
      return this.onlineFriends()[contactID]?.isOnline ? true : false;
    return false;
  }

  onTyping() {
    this.messageSocket.userTyping({
      senderID: this.user()?._id,
      receiverID: this.contact()?._id,
      status: 'started',
      type: 'typing',
    });
  }

  onFinishedTyping() {
    this.messageSocket.userTyping({
      senderID: this.user()?._id,
      receiverID: this.contact()?._id,
      status: 'finished',
      type: 'typing',
    });
  }
}
