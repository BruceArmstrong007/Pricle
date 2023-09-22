import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FirebaseModule, RMQClient, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UploadRepository } from './Storage/upload.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';

@Module({
  imports: [
    FirebaseModule,
    ...[RMQClient.UPLOAD_USER].map((client: string) =>
      RmqModule.register({ name: client }),
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/upload/.env',
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
        MESSAGE_BROKER_URI: Joi.string().required(),
        PORT: Joi.required(),
        CLIENT_URI1: Joi.string().required(),
        CLIENT_URI2: Joi.string().required(),
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
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
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository, JwtAuthStrategy],
})
export class UploadModule {}
