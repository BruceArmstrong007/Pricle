import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Channel, ChannelsState } from './channels.model';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { channelsActions } from './channels.action';
import { MessageStatus } from 'src/app/shared/utils/variables';
import { userFeature } from '../user/user.reducer';

const adaptor: EntityAdapter<Channel> = createEntityAdapter<Channel>({
  selectId: (s: Channel) => s.roomID,
});

const initialState: ChannelsState = adaptor.getInitialState();

export const channelsFeature = createFeature({
  name: 'channels',
  reducer: createReducer(
    initialState,
    on(channelsActions.setRoomsMessages, (state, actions): ChannelsState => {
      return adaptor.setAll(actions?.rooms, state);
    }),
    on(channelsActions.removeTyping, (state, actions): ChannelsState => {
      return adaptor.updateOne(
        {
          id: actions?.roomID,
          changes: {
            typing: [
              ...(state?.entities[actions?.roomID]?.typing?.filter(
                (type) => type?.senderID !== actions?.typing?.senderID
              ) ?? []),
            ],
          },
        },
        state
      );
    }),
    on(channelsActions.setTyping, (state, actions): ChannelsState => {
      return adaptor.updateOne(
        {
          id: actions?.roomID,
          changes: {
            typing: [
              ...(state?.entities[actions?.roomID]?.typing ?? []),
              actions?.typing,
            ],
          },
        },
        state
      );
    }),
    on(channelsActions.addRoomMessage, (state, actions): ChannelsState => {
      return adaptor.updateOne(
        {
          id: actions?.roomID,
          changes: {
            messages: [
              ...(state?.entities[actions?.roomID]?.messages ?? []),
              actions?.message,
            ],
          },
        },
        state
      );
    }),
    on(channelsActions.bulkStatusUpdate, (state, action): ChannelsState => {
      return adaptor.mapOne(
        {
          id: action?.roomID,
          map: (room) => {
            const data = action?.updateSatus;
            const userID = action?.userID;
            const messages = room?.messages?.map((msg: any) => {
              const condition = msg?.status == data?.prevStatus;
              // not necessory
              if (
                data?.userID == userID &&
                msg.senderID != userID &&
                condition
              ) {
                return {
                  ...msg,
                  status: data?.crntStatus,
                };
              }
              // necessory
              if (
                data?.userID != userID &&
                msg.senderID == userID &&
                condition
              ) {
                return {
                  ...msg,
                  status: data?.crntStatus,
                };
              }
              return msg;
            });
            return {
              ...room,
              messages,
            };
          },
        },
        state
      );
    }),
    on(
      channelsActions.specificMessageStatusUpdate,
      (state, action): ChannelsState => {
        return adaptor.mapOne(
          {
            id: action?.roomID,
            map: (room) => {
              const data = action?.updateSatus;
              const messages = room?.messages?.map((msg: any) => {
                const condition = msg.status == data?.prevStatus;
                const thisMessage = data?.messageID.find(
                  (id: string) => msg?.messageID === id
                );
                if (thisMessage && condition) {
                  return {
                    ...msg,
                    status: data?.crntStatus,
                  };
                }
                return msg;
              });
              return {
                ...room,
                messages,
              };
            },
          },
          state
        );
      }
    ),
    on(channelsActions.removeRoom, (state, action): ChannelsState => {
      return adaptor.removeOne(action?.roomID, state);
    }),
    on(
      channelsActions.resetState,
      (state): ChannelsState => ({
        ...state,
        ...initialState,
      })
    )
  ),
  extraSelectors: ({ selectChannelsState }) => {
    const selectors = adaptor.getSelectors(selectChannelsState);
    const selectAll = selectors.selectAll;
    return {
      ...selectors,
      totalDeliveredStatus: createSelector(
        selectAll,
        userFeature.selectDetails,
        (selectAll, user) => {
          return [
            ...selectAll.map((room) => {
              const count = room?.messages?.filter(
                (message) =>
                  message?.status === MessageStatus.DELIVERED &&
                  message?.senderID !== user?._id
              )?.length;
              return {
                roomID: room?.roomID,
                count: count ?? 0,
              };
            }),
          ];
        }
      ),
    };
  },
});
