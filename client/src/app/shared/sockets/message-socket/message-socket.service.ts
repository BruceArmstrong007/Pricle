import { Injectable, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { authFeature } from 'src/app/stores/auth/auth.reducer';
import { channelsActions } from 'src/app/stores/channels/channels.action';
import { MessageState } from 'src/app/stores/channels/channels.model';
import { contactsFeature } from 'src/app/stores/contacts/contacts.reducer';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { environment } from 'src/environments/environment';
import { MessageStatus } from '../../utils/variables';

export interface UpdateStatus {
  roomID: string;
  userID: string;
  messageID: string[];
  prevStatus: string;
  crntStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageSocketService {
  private socket: Socket | undefined;
  private readonly store = inject(Store);
  private readonly user = this.store.selectSignal(userFeature?.selectDetails);
  private readonly friendListIDs = this.store.selectSignal(
    contactsFeature?.friendListIDs
  );

  private readonly accesssToken$ = this.store.select(
    authFeature?.selectAccessToken
  );
  constructor() {
    this.accesssToken$
    .pipe(
      filter((res) => (res ? true : false)),
      // take(1)
    ).subscribe((accessToken) => {
      if (this.socket) this.disconnect();
      this.socket = io(environment.wsURL + '/message', {
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
        this.listenForMessages();
        this.listenForTyping();
        this.listenForMessageUpdates();
      });
    });

    effect(() => {
      const friendListIDs = this.friendListIDs();
      if (friendListIDs && friendListIDs?.length > 0) {
        this.getMessages(friendListIDs);
      }
    });
  }

  sendMessages(message: Partial<MessageState>) {
    this.socket?.emit('send-message', message);
  }

  userTyping(message: Partial<MessageState>) {
    this.socket?.emit('user-typing', message);
  }

  // Get all friend messages and store in state
  getMessages(contactIDs: string[]) {
    this.socket?.emit('get-messages', { contactIDs }, async (data: any) => {
      const rooms = data?.map((room: any) => {
        // set redis db that we got the messages that are sent sent (single tick)
        this.socket?.emit('message-status', {
          roomID: room.roomID,
          userID: this.user()?._id,
          messageID: [],
          crntStatus: MessageStatus.DELIVERED,
          prevStatus: MessageStatus.SENT,
        });
        let message!: any;
        message = room.messages[0];
        if (typeof room?.messages == 'string') {
          message = JSON.parse(room?.messages);
        }
        return {
          roomID: room.roomID,
          messages: message ? message : [],
          typing: [],
        };
      });
      this.store.dispatch(channelsActions.setRoomsMessages({ rooms }));
    });
  }

  // if reciever views user chat, update the delivered to seen realtime
  seenMessages(room: Partial<UpdateStatus>) {
    this.socket?.emit('message-status', {
      roomID: room.roomID,
      userID: this.user()?._id,
      messageID: room.messageID,
      crntStatus: MessageStatus.SEEN,
      prevStatus: MessageStatus.DELIVERED,
    });
  }

  generateRoomIDs(id1: string, id2: string): string {
    return [id1, id2].sort().join('-');
  }

  // listening for typing realtime
  listenForTyping() {
    this.socket?.on('typing', (typing: MessageState) => {
      if (typing?.senderID === this.user()?._id) return;
      const roomID = this.generateRoomIDs(typing?.senderID, typing?.receiverID);
      this.store.dispatch(channelsActions.setTyping({ typing, roomID }));
      if (typing?.status === 'started') {
        this.store.dispatch(channelsActions.setTyping({ typing, roomID }));
      }
      if (typing?.status === 'finished') {
        this.store.dispatch(channelsActions.removeTyping({ typing, roomID }));
      }
    });
  }

  // listening for messages send to user realtime
  listenForMessages() {
    this.socket?.on('receive-message', async (message) => {
      const roomID = this.generateRoomIDs(
        message?.senderID,
        message?.receiverID
      );
      this.store.dispatch(channelsActions.addRoomMessage({ message, roomID }));
      if (message?.senderID !== this.user()?._id) {
        this.socket?.emit('message-status', {
          roomID: roomID,
          messageID: [message?.messageID],
          crntStatus: MessageStatus.DELIVERED,
          prevStatus: MessageStatus.SENT,
        });
      }
    });
  }

  // listening where message is delivered or seen realtime
  listenForMessageUpdates() {
    this.socket?.on('update-status', async (data) => {
      if (data?.messageID?.length === 0) {
        this.store.dispatch(
          channelsActions.bulkStatusUpdate({
            roomID: data?.roomID,
            userID: this.user()?._id as string,
            updateSatus: data,
          })
        );
      } else {
        this.store.dispatch(
          channelsActions.specificMessageStatusUpdate({
            roomID: data?.roomID,
            updateSatus: data,
          })
        );
      }
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket?.removeAllListeners();
    this.socket?.close();
  }
}
