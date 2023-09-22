import { Socket } from 'socket.io';
export interface Message {
  messageID: string;
  senderID: string;
  receiverID: string;
  timestamp: string;
  content: string;
  status: string;
  actions: string;
  type: string;
}

export type AuthPayload = {
  userID: string;
}

export type SocketWithAuth = Socket & AuthPayload;
