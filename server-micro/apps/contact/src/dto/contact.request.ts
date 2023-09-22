import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class Contact {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  constructor(private assign: Partial<Contact>) {
    Object.assign(this, assign);
  }
}
