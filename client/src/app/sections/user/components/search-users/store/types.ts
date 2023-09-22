import {
  ComponentStateFeature,
  ContactCardItems,
} from 'src/app/shared/utils/types';
import { User } from 'src/app/stores/user/user.model';

export interface SearchUsersState extends ComponentStateFeature {
  users: SearchUserDetails[];
  name: string;
  items: ContactCardItems[];
}

export enum SearchUsersCard {
  SEND = 'send',
}

export interface SearchUserDetails extends User {
  isContact: boolean;
}
