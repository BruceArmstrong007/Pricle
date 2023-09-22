import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { matchPassword } from '@app/common';

export class Register {
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
  @IsAlphanumeric()
  @Matches(/\d/, {
    message: 'At least one number should be present in the string',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Validate(matchPassword, ['password'])
  confirmPassword: string;

  constructor(private assign: Partial<Register>) {
    Object.assign(this, assign);
  }
}

export class Login {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @IsAlphanumeric()
  @Matches(/\d/, {
    message: 'At least one number should be present in the string',
  })
  password: string;

  constructor(private assign: Partial<Login>) {
    Object.assign(this, assign);
  }
}

export class Refresh {
  @IsString()
  @IsNotEmpty()
  refresh: string;

  constructor(private assign: Partial<Refresh>) {
    Object.assign(this, assign);
  }
}

export class VerifyEmailLink {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(private assign: Partial<VerifyEmailLink>) {
    Object.assign(this, assign);
  }
}
export class ResetPasswordLink {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(private assign: Partial<VerifyEmailLink>) {
    Object.assign(this, assign);
  }
}

export class VerifyEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  token: string;

  constructor(private assign: Partial<VerifyEmail>) {
    Object.assign(this, assign);
  }
}

export class ResetPassword {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @IsAlphanumeric()
  @Matches(/\d/, {
    message: 'At least one number should be present in the string',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Validate(matchPassword, ['password'])
  confirmPassword: string;

  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  token: string;

  constructor(private assign: Partial<ResetPassword>) {
    Object.assign(this, assign);
  }
}
