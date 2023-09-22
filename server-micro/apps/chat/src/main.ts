import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { RMQClient, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './adapter/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(
    rmqService.getOption(RMQClient.CHAT, true),
  );
  await app.startAllMicroservices();
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
