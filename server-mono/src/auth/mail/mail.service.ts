import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(user: any) {
    //User & Token
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
          token: user?.token,
        },
      })
      .catch((err) => console.log(err));
  }

  async sendResetPasswordLink(user: any) {
    //User & Token
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

  async changeEmailVerification(user: {
    email: string;
    token: string;
    username: string;
  }) {
    //User & Token
    const encoded = btoa(
      JSON.stringify({ email: user?.email, token: user?.token }),
    );
    const url = `${this.configService.get(
      'CLIENT_URI1',
    )}/user/settings/account?token=${encoded}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        from: '"Support Team" <' + this.configService.get('MAIL_FROM') + '>',
        subject: 'Verify your new email',
        template: './email-verification',
        context: {
          name: user.username,
          url,
          token: user?.token,
        },
      })
      .catch((err) => console.log(err));
  }
}
