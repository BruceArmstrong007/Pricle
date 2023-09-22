import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../schema/token.schema';
import { CurrentUserType, TokenType } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthRepository {
  protected readonly logger = new Logger(AuthRepository.name);

  constructor(
    @InjectModel(Token.name) public readonly tokenModel: Model<Token>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async setToken(email: string, type: TokenType, token: string) {
    const tokenModel = await new this.tokenModel({
      email,
      type,
      token,
    });
    await tokenModel.save();
  }

  async getToken(email: string, type?: TokenType): Promise<Token | null> {
    let condition: Record<string, string> = { email };
    if (type) {
      condition = { ...condition, type };
    }
    return await this.tokenModel.findOne(condition).exec();
  }

  async generateJWT(payload: CurrentUserType) {
    const accessToken = await this.jwt(
      payload,
      this.configService.get('JWT_EXPIRATION') + 's',
    );
    const refreshToken = await this.jwt(payload, '7d');
    return { accessToken, refreshToken };
  }

  async generateRefreshToken(payload: CurrentUserType) {
    const accessToken = await this.jwt(
      payload,
      this.configService.get('JWT_EXPIRATION') + 's',
    );
    return { accessToken };
  }

  private async jwt(payload: any, expiresIn: string) {
    return await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: expiresIn,
    });
  }
}
