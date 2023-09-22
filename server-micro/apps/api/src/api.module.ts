import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule, RMQClient } from '@app/common';

@Module({
  imports: [
    ...[RMQClient.AUTH, RMQClient.CHAT, RMQClient.CONTACT, RMQClient.USER].map(
      (client: string) => RmqModule.register({ name: client }),
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: Joi.object({
        MESSAGE_BROKER_URI: Joi.string().required(),
        PORT: Joi.required(),
        CLIENT_URI1: Joi.string().required(),
        CLIENT_URI2: Joi.string().required(),
      }),
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
