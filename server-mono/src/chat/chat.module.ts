import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageGateway } from './gateway/message/message.gateway';
import { UserGateway } from './gateway/user/user.gateway';
import { RedisProvider } from '@app/common';
import { EventGateway } from './gateway/event/event.gateway';
import { ChatRepository } from './database/repository/chat.repository';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [
    MessageGateway,
    UserGateway,
    RedisProvider,
    EventGateway,
    ChatRepository,
    ChatService,
  ],
  exports: [ChatService, ChatRepository]
})
export class ChatModule {}
