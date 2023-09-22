import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { matchPassword } from '@app/common';

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Validate(matchPassword, ['password'])
  confirmPassword: string;

  constructor(private assign: Partial<CreateUser>) {
    Object.assign(this, assign);
  }
}

export class ResetPassword {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Validate(matchPassword, ['password'])
  confirmPassword: string;

  constructor(private assign: Partial<ResetPassword>) {
    Object.assign(this, assign);
  }
}

export class ChangeEmailLink {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(private assign: Partial<ChangeEmailLink>) {
    Object.assign(this, assign);
  }
}

export class ChangeEmail {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  constructor(private assign: Partial<ChangeEmail>) {
    Object.assign(this, assign);
  }
}

export class ValidateUser {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  constructor(private assign: Partial<ValidateUser>) {
    Object.assign(this, assign);
  }
}

export class UpdateUser {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  constructor(private assign: Partial<UpdateUser>) {
    Object.assign(this, assign);
  }
}

export class UploadProfile {
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsString()
  @IsNotEmpty()
  filename?: string;

  constructor(private assign: Partial<UploadProfile>) {
    Object.assign(this, assign);
  }
}
export class VerfiyUser {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  constructor(private assign: Partial<VerfiyUser>) {
    Object.assign(this, assign);
  }
}

export class SetEmailToken {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(private assign: Partial<VerfiyUser>) {
    Object.assign(this, assign);
  }
}

export class VerifyEmailToken {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  constructor(private assign: Partial<VerfiyUser>) {
    Object.assign(this, assign);
  }
}

export class SetResetPasswordToken {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(private assign: Partial<VerfiyUser>) {
    Object.assign(this, assign);
  }
}

export class ResetPasswordWithToken {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Validate(matchPassword, ['password'])
  confirmPassword: string;

  constructor(private assign: Partial<VerfiyUser>) {
    Object.assign(this, assign);
  }
}

export class Contact {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  constructor(private assign: Partial<Contact>) {
    Object.assign(this, assign);
  }
}

export class Contacts {
  @IsArray()
  @IsNotEmpty()
  contacts: string[];

  constructor(private assign: Partial<Contact>) {
    Object.assign(this, assign);
  }
}
