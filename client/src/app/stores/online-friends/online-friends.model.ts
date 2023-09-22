import { EntityState } from '@ngrx/entity';

export interface OnlineUsers {
  id: string;
  socketID: string;
  isOnline: boolean;
}

export interface OnlineUsersState extends EntityState<OnlineUsers> {}
