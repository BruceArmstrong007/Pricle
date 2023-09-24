import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Socket, io } from 'socket.io-client';
import { Store } from '@ngrx/store';
import { authFeature } from 'src/app/stores/auth/auth.reducer';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { contactsActions } from 'src/app/stores/contacts/contacts.action';
import { MessageService } from 'primeng/api';
import { onlineFriendsActions } from '../../../stores/online-friends/online-friends.action';
import { OnlineUsers } from 'src/app/stores/online-friends/online-friends.model';
import { filter } from 'rxjs';

interface ContactNotification {
  type: string;
  data: {
    status: string;
    userID: string;
    contactID: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserSocketService {
  private socket: Socket | undefined;
  private readonly store = inject(Store);
  private readonly accesssToken$ = this.store.select(
    authFeature?.selectAccessToken
  );
  private readonly accesssToken = this.store.selectSignal(
    authFeature?.selectAccessToken
  );
  private readonly contactIDs = this.store.selectSignal(
    contactsFeature?.friendsIDs
  );
  private readonly contactEntities = this.store.selectSignal(
    contactsFeature?.selectEntities
  );
  private readonly toastService = inject(MessageService);

  constructor() {
    this.accesssToken$
    .pipe(
      filter((res) => (res ? true : false)),
      // take(1)
    ).subscribe((accessToken) => {
      if (this.socket) this.disconnect();
      this.socket = io(environment.wsURL + '/user', {
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        transports: ['websocket', 'polling'],
        query: {
          token: accessToken,
        },
      });
      this.socket?.on('connect', () => {
        this.establishConnection();
        this.listenToNotifications();
      });
    });
  }

  establishConnection() {
    this.userOnline();
    this.getOnlineFriends();
    const online = setInterval(() => {
      if (!this.accesssToken()) {
        clearInterval(online);
        return;
      }
      this.userOnline();
      this.getOnlineFriends();
    }, 1000);
  }

  // Set user as online as a ttl cache in redis
  userOnline() {
    this.socket?.emit('online');
  }
  // Get online friends list
  getOnlineFriends() {
    if (this.contactIDs()?.length > 0)
      this.socket?.emit(
        'online-friends',
        { contactIDs: this.contactIDs() },
        (isOnline: OnlineUsers[]) => {
          this.store.dispatch(onlineFriendsActions.setOnline({ isOnline }));
        }
      );
  }

  listenToNotifications() {
    this.socket?.on('notify-contact', (event: ContactNotification) => {
      switch (event?.type) {
        case 'contact':
          this.handleContactNotifications(event);
          break;
        default:
      }
    });
  }

  handleContactNotifications(event: ContactNotification) {
    this.store.dispatch(contactsActions.contacts());
    const contactName = this.contactEntities()[event?.data?.contactID]?.name;
    switch (event?.data?.status) {
      case 'accept-request':
        this.toastService.add({
          severity: 'success',
          summary: 'You got a new friend!',
          detail: contactName + ' accepted your friend request',
        });
        break;
      case 'send-request':
        this.toastService.add({
          severity: 'success',
          summary: 'You got a new friend request!',
          detail: 'Someone sent you friend request',
        });
        break;
      case 'cancel-request':
        break;
      case 'decline-request':
        break;
      case 'remove-contact':
        break;
        case 'account-deleted':
          break;
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket?.removeAllListeners();
    this.socket?.close();
  }
}
