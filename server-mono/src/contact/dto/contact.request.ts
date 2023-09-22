import { ContactStatus, ContactType } from '@app/common';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class Contact {
  @IsString()
  @IsNotEmpty()
  contactID: string;

  constructor(private assign: Partial<Contact>) {
    Object.assign(this, assign);
  }
}
export class SeenContact {
  @IsString()
  @IsNotEmpty()
  contactID: string;

  @IsIn([ContactType.SENDER, ContactType.RECEIVER])
  @IsNotEmpty()
  type: ContactType.SENDER | ContactType.RECEIVER;

  @IsIn([ContactStatus.SENT, ContactStatus.ACCEPTED])
  @IsNotEmpty()
  status: ContactStatus.SENT | ContactStatus.ACCEPTED;

  constructor(private assign: Partial<Contact>) {
    Object.assign(this, assign);
  }
}
