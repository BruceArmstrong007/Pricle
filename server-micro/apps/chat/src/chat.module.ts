import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RMQClient, RedisProvider, RmqModule } from '@app/common';
import { MessageGateway } from './gateway/message/message.gateway';
import { UserGateway } from './gateway/user/user.gateway';
import { EventGateway } from './gateway/event/event.gateway';
import { ChatRepository } from './database/repository/chat.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
        MESSAGE_BROKER_URI: Joi.string().required(),
        PORT: Joi.required(),
        CLIENT_URI1: Joi.string().required(),
        CLIENT_URI2: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        REDIS_PASS: Joi.string().required(),
        REDIS_URI: Joi.string().required(),
        REDIS_PORT: Joi.required(),
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
    ...[RMQClient.CONTACT_USER].map((client: string) =>
      RmqModule.register({ name: client }),
    ),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    MessageGateway,
    UserGateway,
    RedisProvider,
    EventGateway,
    ChatRepository,
  ],
})
export class ChatModule {}
