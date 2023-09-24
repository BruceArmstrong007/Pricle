import { Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { UserRepository } from './database/repository/user.repository';
import { User } from './database/schema/user.schema';
import { ContactService } from '../contact/contact.service';
import { Inject } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { CurrentUserType } from '@app/common';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
    @Inject(forwardRef(() => UploadService))
    private readonly uploadService: UploadService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async searchUsers(name: string, username: string) {
    const users = (await this.userRepository.findUsers(name, username)) ?? [];
    return { users };
  }

  async validateUser(body: Partial<User>) {
    const user = await this.userRepository.userProfile(body?.username);
    if (!user) {
      throw new BadRequestException('User doesnot exist.');
    }
    if (await this.userRepository.comparePassword(user._id, body?.password)) {
      return user;
    } else {
      throw new BadRequestException('Invalid username or password.');
    }
  }
  async verifyUser(body: Partial<User>) {
    const user = await this.userRepository.findByUsername(body?.username);
    if (!user) {
      throw new UnprocessableEntityException("User doesn't exists.");
    }
    return {
      username: user?.username,
      userID: user?._id,
      verified: user?.verified,
      email: user?.email,
    };
  }

  async userProfile(user: Partial<User>) {
    return await this.userRepository.userProfile(user?.username);
  }

  async createUser(body: Partial<User>) {
    await this.userExist({
      username: body?.username,
    });
    await this.userRepository.createUser(
      body?.username,
      body?.email,
      body?.password,
    );
    return { message: 'Successfully registed.' };
  }

  async deleteUser(body: CurrentUserType) {
    await this.verifyUser({
      username: body?.username,
    });
    await this.contactService.deleteUserContact(body?.userID);
    const user = await this.userRepository.findByUsername(body?.username);
    await this.uploadService.deleteProfile(user?.profile?.filename);
    await this.userRepository.deleteUser(body?.username);
    return { message: 'User successfully deleted.' };
  }

  async updateUser(body: Partial<User>, userID: string) {
    await this.userRepository.updateUser(userID, body);
    return { message: 'User details updated.' };
  }

  async resetPassword(body: Partial<User>, username: string) {
    await this.userRepository.resetPassword(username, body?.password);
    return { message: 'Password changed successfully.' };
  }

  async changeEmailLink(user: CurrentUserType, email: string) {
    await this.authService.changeEmailLink(user, email);
    return {
      message: 'Verification link has been sent to your email inbox.',
    };
  }

  async changeEmailVerification(
    user: CurrentUserType,
    email: string,
    token: string,
  ) {
    await this.authService.changeEmailVerification(user, email, token);
    return {
      message: 'Email has been changed successfully.',
    };
  }

  async uploadProfile(userID: string, body: any) {
    await this.userRepository.uploadProfile(userID, body?.filename, body?.url);
    return { message: 'Profile picture updated.' };
  }

  async isExist(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (user) {
      return true;
    }
    return false;
  }

  async getUsers(contacts: Types.ObjectId[]) {
    const users = await this.userRepository.getUsers(contacts);
    return users;
  }

  async getUser(contactID: string) {
    return await this.userRepository.findByID(contactID);
  }

  async logout(response: Response) {
    await response.clearCookie('refreshToken');
    await response.clearCookie('isLoggedIn');
    response.status(200).json({ message: 'Logout successful' });
  }

  private async userExist(request: Partial<User>) {
    const user = await this.userRepository.findByUsername(request?.username);
    if (user) {
      throw new UnprocessableEntityException('User already exists.');
    }
  }
}
