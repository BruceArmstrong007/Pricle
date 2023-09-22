import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RMQClient, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(
    rmqService.getOption(RMQClient.AUTH, true),
    {
      inheritAppConfig: true,
    },
  );
  await app.startAllMicroservices();
}
bootstrap();
