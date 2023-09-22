import { createFeature, createReducer, on } from '@ngrx/store';
import { onlineFriendsActions } from './online-friends.action';
import { OnlineUsers, OnlineUsersState } from './online-friends.model';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

const adaptor: EntityAdapter<OnlineUsers> = createEntityAdapter<OnlineUsers>({
  selectId: (s: OnlineUsers) => s.id,
});
const initialState: OnlineUsersState = adaptor.getInitialState({});

export const onlineFriendsFeature = createFeature({
  name: 'onlineFriends',
  reducer: createReducer(
    initialState,
    on(
      onlineFriendsActions.setOnline,
      (state, action): OnlineUsersState =>
        adaptor.upsertMany(action.isOnline, state)
    ),
    on(
      onlineFriendsActions.resetState,
      (state): OnlineUsersState => ({ ...state, ...initialState })
    )
  ),
  extraSelectors: ({ selectOnlineFriendsState }) => ({
    ...adaptor.getSelectors(selectOnlineFriendsState),
  }),
});
