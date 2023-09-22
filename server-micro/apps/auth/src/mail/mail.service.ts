import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Token } from 'apps/user/src/database/schema/token.schema';
import { User } from 'apps/user/src/database/schema/user.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(user: User & Token) {
    const encoded = btoa(
      JSON.stringify({ email: user?.email, token: user?.token }),
    );
    const url = `${this.configService.get(
      'CLIENT_URI1',
    )}/auth/verify-account?token=${encoded}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        from: '"Support Team" <' + this.configService.get('MAIL_FROM') + '>',
        subject: 'Welcome to Pricle Chat! Confirm your Email',
        template: './email-verification',
        context: {
          name: user.username,
          url,
          token: user?.token
        },
      })
      .catch((err) => console.log(err));
  }

  async sendResetPasswordLink(user: User & Token) {
    const encoded = btoa(
      JSON.stringify({ email: user?.email, token: user?.token }),
    );
    const url = `${this.configService.get(
      'CLIENT_URI1',
    )}/auth/reset-password?token=${encoded}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        from: '"Support Team" <' + this.configService.get('MAIL_FROM') + '>',
        subject: 'Welcome to Pricle Chat! Confirm your Email',
        template: './reset-password',
        context: {
          name: user.username,
          url,
        },
      })
      .catch((err) => console.log(err));
  }
}
