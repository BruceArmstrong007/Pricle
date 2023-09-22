import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Token } from '../schema/token.schema';
import { TokenType } from '@app/common';
@Injectable()
export class UserRepository {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Token.name) public readonly tokenModel: Model<Token>,
    private readonly configService: ConfigService,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel
      .findOne({ username })
      .select('-password')
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).select('-password').exec();
  }

  async findByID(id: string): Promise<User | null> {
    return await this.userModel.findById(id).select('-password').exec();
  }

  async userProfile(username: string): Promise<User | null> {
    return await this.userModel
      .findOne({ username })
      .select('-password')
      .exec();
  }

  async createUser(
    username: string,
    email: string,
    unHashedPass: string,
  ): Promise<User> {
    const name = 'User-' + uuidv4();
    const password = await bcrypt.hash(
      unHashedPass,
      Number(this.configService.get('HASH_SALT')),
    );
    const newUser = new this.userModel({
      username,
      password,
      name,
      email,
    });
    return await newUser.save();
  }

  async updateUser(
    username: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate({ username: username }, updates, { new: true })
      .exec();
  }

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

  async uploadProfile(username: string, filename: string, url: string) {
    await this.userModel
      .findOneAndUpdate(
        { username: username },
        { profile: { filename, url } },
        { new: true },
      )
      .exec();
  }

  async resetPassword(username: string, unHashedPass: string) {
    const password = await bcrypt.hash(
      unHashedPass,
      Number(this.configService.get('HASH_SALT')),
    );
    await this.userModel
      .findOneAndUpdate({ username: username }, { password }, { new: true })
      .exec();
  }

  async deleteUser(username: string): Promise<User | null> {
    return await this.userModel.findOneAndDelete({ username: username }).exec();
  }

  async comparePassword(id: string, password: string) {
    const user: User = await this.userModel.findById(id).exec();
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }

  async getUsers(users: string[]): Promise<User[]> {
    return await this.userModel
      .find({
        username: { $in: users },
      })
      .select('-password')
      .exec();
  }
}
