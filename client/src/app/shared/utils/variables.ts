export enum ContactStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  ACCEPTED = 'ACCEPTED',
  FRIENDS = 'FRIENDS',
  BLOCKED = 'BLOCKED',
}

export enum ContactType {
  SENDER = 'SENT',
  RECEIVER = 'RECEIVED',
}
export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  SEEN: 'seen',
}


export type Size = "normal" | "large" | "xlarge" | undefined;
