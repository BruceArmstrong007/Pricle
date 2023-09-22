import { EntityState } from '@ngrx/entity';
import { ContactStatus, ContactType } from 'src/app/shared/utils/variables';

export interface ContactsState extends EntityState<ContactDetails> {
  isLoading: boolean;
}

export interface ContactsFailure {
  message: string;
  statusCode: number;
}

export interface ContactDetails {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profile: {
    url: string;
    filename: string;
  };
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  status: ContactStatus;
  type: ContactType;
}



export interface SeenContact {
  contactID: string;
  type: ContactType;
  status: ContactStatus;
}
