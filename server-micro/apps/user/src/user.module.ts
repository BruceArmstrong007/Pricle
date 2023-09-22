import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoDBModule, RMQClient, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './database/schema/user.schema';
import { UserRepository } from './database/repository/user.repository';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Token, TokenSchema } from './database/schema/token.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_NAME: Joi.string().required(),
        MESSAGE_BROKER_URI: Joi.string().required(),
        HASH_SALT: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
      }),
    }),
    RmqModule,
    ...[RMQClient.USER_CONTACT].map((client: string) =>
      RmqModule.register({ name: client }),
    ),
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
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtAuthStrategy],
})
export class UserModule {}
