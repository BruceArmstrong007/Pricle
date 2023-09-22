import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RMQClient, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = await app.get<RmqService>(RmqService);
  [
    RMQClient.USER,
    RMQClient.AUTH_USER,
    RMQClient.CONTACT_USER,
    RMQClient.UPLOAD_USER,
  ].forEach((service: string) => {
    app.connectMicroservice<RmqOptions>(rmqService.getOption(service, true));
  });
  await app.startAllMicroservices();
}
bootstrap();
