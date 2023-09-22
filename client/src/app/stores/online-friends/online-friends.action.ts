import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OnlineUsers } from './online-friends.model';

export const onlineFriendsActions = createActionGroup({
  source: 'Online Friends Actions',
  events: {
    SetOnline: props<{ isOnline: OnlineUsers[] }>(),

    ResetState: emptyProps(),

  },
});
