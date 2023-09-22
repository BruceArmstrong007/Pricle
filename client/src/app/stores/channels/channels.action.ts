import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Channel, MessageState } from './channels.model';
import { UpdateStatus } from 'src/app/shared/sockets/message-socket/message-socket.service';

export const channelsActions = createActionGroup({
  source: 'Channels Action',
  events: {
    setRoomsMessages: props<{ rooms: Channel[] }>(),
    setTyping: props<{ typing: MessageState; roomID: string }>(),
    removeTyping: props<{ typing: MessageState; roomID: string }>(),
    addRoomMessage: props<{ message: MessageState; roomID: string }>(),
    // deliveredToSeenStatus: props<{ roomID: string; contactID: string }>(),
    bulkStatusUpdate: props<{
      roomID: string;
      userID: string;
      updateSatus: UpdateStatus;
    }>(),
    specificMessageStatusUpdate: props<{
      roomID: string;
      updateSatus: UpdateStatus;
    }>(),
    removeRoom: props<{ roomID: string }>(),

    resetState: emptyProps(),

  },
});
