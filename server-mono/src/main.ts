import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { SocketIOAdapter } from './chat/adapter/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: [
      configService.get('CLIENT_URI1'),
      configService.get('CLIENT_URI2'),
    ],
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(configService.get('PORT'));
}
bootstrap();
