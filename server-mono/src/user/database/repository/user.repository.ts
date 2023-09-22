import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
@Injectable()
export class UserRepository {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
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

  async findUsers(name: string, username: string): Promise<User[] | null> {
    const regex = new RegExp(name, 'i');
    return await this.userModel
      .find({ name: regex, username: { $ne: username } })
      .select('-password')
      .exec();
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
    userID: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(userID, updates, { new: true })
      .exec();
  }

  async uploadProfile(userID: string, filename: string, url: string) {
    await this.userModel
      .findByIdAndUpdate(userID, { profile: { filename, url } }, { new: true })
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

  async getUsers(users: Types.ObjectId[]): Promise<any> {
    return await this.userModel
      .find({
        _id: { $in: users },
      })
      .select('-password')
      .exec();
  }
}
