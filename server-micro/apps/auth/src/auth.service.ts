import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Login,
  Register,
  ResetPassword,
  ResetPasswordLink,
  VerifyEmail,
} from './dto/auth.request';
import { CurrentUserType, RMQClientService } from '@app/common';
import { User } from 'apps/user/src/database/schema/user.schema';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail/mail.service';
import { Token } from 'apps/user/src/database/schema/token.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(RMQClientService.AUTH_USER)
    private readonly userClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(body: Login) {
    return this.userClient.send('validateUser', { data: body }).pipe(
      map((user: User) => {
        if (!user?.verified) {
          throw new BadRequestException("User's email is not verified.");
        }
        const payload = {
          userID: user._id,
          username: user.username,
          email: user.email,
          verified: user.verified,
        };
        const accessToken = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRATION') + 's',
        });
        const refreshToken = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        });
        return { refreshToken, accessToken };
      }),
    );
  }

  async register(body: Register) {
    return this.userClient.send('createUser', { data: body }).pipe(
      map(() => {
        this.sendVerificationEmail(new VerifyEmail(body));
        return {
          message:
            'Registed Successfully, please check your email inbox for account verification',
        };
      }),
    );
  }

  async refresh(body: CurrentUserType, refresh: string) {
    return this.userClient
      .send('verifyUser', {
        data: { username: body?.username },
        Authentication: refresh,
      })
      .pipe(
        map((user: CurrentUserType) => {
          const payload = {
            userID: user.userID,
            username: user.username,
            email: user.email,
            verified: user.verified,
          };
          const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION') + 's',
          });
          return { accessToken };
        }),
      );
  }

  async sendVerificationEmail(data: VerifyEmail) {
    return this.userClient.send('setEmailToken', { data }).pipe(
      map((user: User & Token) => {
        this.mailService.sendVerificationEmail(user);
        return {
          message: 'Verification link has been sent to your email inbox.',
        };
      }),
    );
  }

  async verifyEmailToken(body: VerifyEmail) {
    return this.userClient.send('verifyEmailToken', { data: body });
  }

  async sendResetPasswordLink(data: ResetPasswordLink) {
    return this.userClient.send('setRestPasswordToken', { data }).pipe(
      map((user: User & Token) => {
        this.mailService.sendResetPasswordLink(user);
        return {
          message: 'Reset Password link has been sent to your email inbox.',
        };
      }),
    );
  }

  async resetPassword(body: ResetPassword) {
    return this.userClient.send('resetPasswordWithToken', { data: body });
  }

  async logout(payload: any) {
    return { message: 'Operation Successful' };
  }
}
