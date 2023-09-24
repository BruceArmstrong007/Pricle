import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../user/database/schema/user.schema';
import { AuthRepository } from './database/repository/auth.repository';
import {
  Register,
  ResetPassword,
  ResetPasswordLink,
  VerifyEmail,
  VerifyEmailLink,
} from './dto/auth.request';
import { UserService } from '../user/user.service';
import { MailService } from './mail/mail.service';
import { CurrentUserType, TokenType } from '@app/common';
import { Inject } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async login(user: User, response: Response) {
    if (!user?.verified) {
      throw new BadRequestException("User's email is not verified.");
    }
    const payload = {
      userID: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    };
    const { accessToken, refreshToken } =
      await this.authRepository.generateJWT(payload);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('isLoggedIn', true, {
      sameSite: 'lax',
      secure: false,
    });
    response.status(200).json({ accessToken });
  }

  async register(body: Register) {
    await this.userService.createUser(body);
    return await this.sendVerificationEmail(new VerifyEmailLink(body));
  }

  async refresh(body: CurrentUserType) {
    const user = await this.userService.verifyUser(body);
    const payload = {
      userID: user.userID,
      username: user.username,
      email: user.email,
      verified: user.verified,
    };

    return await this.authRepository.generateRefreshToken(payload);
  }

  async sendVerificationEmail(body: VerifyEmailLink) {
    const unVerifiedUser = await this.userService.findByEmail(body?.email);
    const tokenData = await this.authRepository.getToken(
      body?.email,
      TokenType.EMAIL_VERIFICATION,
    );

    if (!unVerifiedUser) {
      throw new BadRequestException('User with this email doesnot exist.');
    }
    if (unVerifiedUser.verified) {
      throw new BadRequestException('User already verified.');
    }
    if (tokenData?.token) {
      throw new UnprocessableEntityException(
        `Verification link is already sent, please check your inbox or try again in 5 minutes`,
      );
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.authRepository.setToken(
      body?.email,
      TokenType.EMAIL_VERIFICATION,
      token,
    );
    const user = {
      ...unVerifiedUser.toJSON(),
      token: token,
    };
    await this.mailService.sendVerificationEmail(user);
    return {
      message: 'Verification link has been sent to your email inbox.',
    };
  }

  async verifyEmailToken(body: VerifyEmail) {
    const unVerifiedUser = await this.userService.findByEmail(body?.email);
    const tokenData = await this.authRepository.getToken(
      body?.email,
      TokenType.EMAIL_VERIFICATION,
    );
    if (!unVerifiedUser) {
      throw new BadRequestException('User not found.');
    }
    if (unVerifiedUser.verified) {
      throw new BadRequestException('User already verified');
    }

    if (!tokenData || !tokenData?.token) {
      throw new UnprocessableEntityException(
        `Verification link expired, please try again in 5 minutes`,
      );
    }
    if (tokenData?.token !== body?.token) {
      throw new BadRequestException(
        'Something went wrong, try again after 5 minutes.',
      );
    }
    await this.userService.updateUser(
      {
        verified: true,
      },
      unVerifiedUser?._id,
    );
    return { message: 'User successfully verified.' };
  }

  async sendResetPasswordLink(body: ResetPasswordLink) {
    const user = await this.userService.findByEmail(body?.email);
    const tokenData = await this.authRepository.getToken(
      body?.email,
      TokenType.RESET_PASSWORD,
    );

    if (!user) {
      throw new BadRequestException('User with this email doesnot exist.');
    }
    if (tokenData?.token) {
      throw new UnprocessableEntityException(
        `Reset Password link is already sent, please check your inbox or try again in 5 minutes`,
      );
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.authRepository.setToken(
      user?.email,
      TokenType.RESET_PASSWORD,
      token,
    );
    const userData = {
      ...user.toJSON(),
      token: token,
    };
    await this.mailService.sendResetPasswordLink(userData);
    return {
      message: 'Reset password link has been sent to your email inbox.',
    };
  }

  async resetPassword(body: ResetPassword) {
    const user = await this.userService.findByEmail(body?.email);
    const tokenData = await this.authRepository.getToken(
      body?.email,
      TokenType.RESET_PASSWORD,
    );
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    if (!tokenData || !tokenData?.token) {
      throw new UnprocessableEntityException(
        `Reset Password link expired, please try again in 5 minutes.`,
      );
    }
    if (tokenData?.token !== body?.token) {
      throw new BadRequestException(
        `Something went wrong, try again after 5 minutes.`,
      );
    }
    await this.userService.resetPassword(
      { password: body?.password },
      user?.username,
    );
    return { message: 'Password changed successfully.' };
  }

  async changeEmailLink(body: CurrentUserType, email: string) {
    const tokenData = await this.authRepository.getToken(
      email,
      TokenType.EMAIL_VERIFICATION,
    );
    if (tokenData?.token) {
      throw new UnprocessableEntityException(`Try again in 5 minutes`);
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.authRepository.setToken(
      email,
      TokenType.EMAIL_VERIFICATION,
      token,
    );
    const user = {
      email,
      token,
      username: body?.username,
    };
    await this.mailService.changeEmailVerification(user);
  }

  async changeEmailVerification(
    body: CurrentUserType,
    email: string,
    token: string,
  ) {
    const tokenData = await this.authRepository.getToken(
      email,
      TokenType.EMAIL_VERIFICATION,
    );

    if (!tokenData || !tokenData?.token) {
      throw new UnprocessableEntityException(
        `Verification link expired, please try again in 5 minutes`,
      );
    }
    if (tokenData?.token !== token) {
      throw new BadRequestException(
        'Something went wrong, try again after 5 minutes.',
      );
    }
    await this.userService.updateUser(
      {
        email: email,
      },
      body?.userID,
    );
  }
}
