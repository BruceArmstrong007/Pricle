import { IsOptional, IsString } from 'class-validator';

export class Profile {
  @IsString()
  @IsOptional()
  prevFilename?: string;

  constructor(private assign: Partial<Profile>) {
    Object.assign(this, assign);
  }
}
