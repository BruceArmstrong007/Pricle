import { EntityState } from '@ngrx/entity';

export interface ChannelsFailure {
  message: string;
  statusCode: number;
}

export interface ChannelsState extends EntityState<Channel> {}

export interface Channel {
  roomID: string;
  messages: MessageState[];
  typing: MessageState[];
}

export interface MessageState {
  messageID: string;
  senderID: string;
  receiverID: string;
  timestamp: string;
  content: string;
  status: string;
  actions: string;
  type: string;
}
