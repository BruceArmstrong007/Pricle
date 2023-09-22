import { NestFactory } from '@nestjs/core';
import { ContactModule } from './contact.module';
import { RMQClient, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ContactModule);
  const rmqService = app.get<RmqService>(RmqService);
  [RMQClient.CONTACT, RMQClient.USER_CONTACT].forEach((service: string) => {
    app.connectMicroservice<RmqOptions>(rmqService.getOption(service, true));
  });
  await app.startAllMicroservices();
}
bootstrap();
