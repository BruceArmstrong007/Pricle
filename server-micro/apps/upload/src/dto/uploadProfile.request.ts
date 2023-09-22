import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Profile {
  @IsString()
  @IsNotEmpty()
  prevFilename: string;

  @IsOptional()
  profile: any;

  constructor(private assign: Partial<Profile>) {
    Object.assign(this, assign);
  }
}
