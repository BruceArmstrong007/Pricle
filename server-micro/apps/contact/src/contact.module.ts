import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoDBModule, RMQClient, RmqModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './database/schema/contact.schema';
import { ContactRepository } from './database/repository/contact.repository';

@Module({
  imports: [
    RmqModule,
    ...[RMQClient.CONTACT_USER].map((client: string) =>
      RmqModule.register({ name: client }),
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/contact/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
        MESSAGE_BROKER_URI: Joi.string().required(),
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
    MongoDBModule,
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [ContactService, JwtAuthStrategy, ContactRepository],
})
export class ContactModule {}
