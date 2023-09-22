import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule, RMQClient } from '@app/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        MESSAGE_BROKER_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
        MAIL_SERVICE: Joi.required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        VERFIY_TOKEN_TIME: Joi.required(),
        CLIENT_URI1: Joi.string().required(),
        CLIENT_URI2: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    ...[RMQClient.AUTH_USER].map((client: string) =>
      RmqModule.register({ name: client }),
    ),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, RefreshJwtStrategy],
})
export class AuthModule {}
