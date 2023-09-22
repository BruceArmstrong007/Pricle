import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
import { LocalAuthStrategy } from './strategy/local-auth.strategy';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { Token, TokenSchema } from './database/schema/token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthRepository } from './database/repository/auth.repository';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtService,
    JwtAuthStrategy,
    RefreshJwtStrategy,
    LocalAuthStrategy,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
