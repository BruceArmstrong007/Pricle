import {
  Injectable,
  UnprocessableEntityException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateUser,
  ResetPassword,
  ResetPasswordWithToken,
  SetEmailToken,
  SetResetPasswordToken,
  UpdateUser,
  UploadProfile,
  ValidateUser,
  VerfiyUser,
  VerifyEmailToken,
} from './dto/user.request';
import { ClientProxy } from '@nestjs/microservices';
import { UserRepository } from './database/repository/user.repository';
import { CurrentUserType, RMQClientService, TokenType } from '@app/common';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(
    @Inject(RMQClientService.USER_CONTACT)
    private readonly contactClient: ClientProxy,
    private readonly userRepository: UserRepository,
  ) {}

  async userProfile(user: CurrentUserType) {
    return await this.userRepository.userProfile(user?.username);
  }

  async getUsers(contacts: string[]) {
    return await this.userRepository.getUsers(contacts);
  }

  async createUser(body: CreateUser) {
    await this.userExist(
      new VerfiyUser({
        username: body?.username,
      }),
    );
    await this.userRepository.createUser(
      body?.username,
      body?.email,
      body?.password,
    );
    return { message: 'Successfully registed.' };
  }

  async deleteUser(body: CurrentUserType, token: string) {
    await this.verifyUser(
      new VerfiyUser({
        username: body?.username,
      }),
    );
    return await this.contactClient
      .send('deleteContact', {
        data: { username: body?.username },
        Authentication: token,
      })
      .pipe(
        map(() => {
          this.userRepository.deleteUser(body?.username);
          return { message: 'User successfully deleted.' };
        }),
      );
  }

  async updateUser(body: UpdateUser, user: CurrentUserType) {
    await this.userRepository.updateUser(user?.username, body);
    return { message: 'User details updated.' };
  }

  async setEmailToken(user: SetEmailToken) {
    const unVerifiedUser = await this.userRepository.findByEmail(user?.email);
    const tokenData = await this.userRepository.getToken(
      user?.email,
      TokenType.EMAIL_VERIFICATION,
    );

    if (!unVerifiedUser) {
      throw new BadRequestException('User with this email doesnot exist.');
    }
    if (unVerifiedUser.verified) {
      throw new BadRequestException('User already verified.');
    }
    if (tokenData?.token) {
      throw new UnprocessableEntityException(
        `Verification link is already sent, please check your inbox or try again in 5 minutes`,
      );
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userRepository.setToken(
      user?.email,
      TokenType.EMAIL_VERIFICATION,
      token,
    );
    return {
      ...unVerifiedUser.toJSON(),
      token: token,
    };
  }

  async verfiyEmailToken(user: VerifyEmailToken) {
    const unVerifiedUser = await this.userRepository.findByEmail(user?.email);
    const tokenData = await this.userRepository.getToken(
      user?.email,
      TokenType.EMAIL_VERIFICATION,
    );
    if (!unVerifiedUser) {
      throw new BadRequestException('User not found.');
    }
    if (unVerifiedUser.verified) {
      throw new BadRequestException('User already verified');
    }
    if (!tokenData || !tokenData?.token) {
      throw new UnprocessableEntityException(
        `Verification link expired, please try again in 5 minutes`,
      );
    }
    if (tokenData?.token !== user?.token) {
      throw new BadRequestException(
        'Something went wrong, try again after 5 minutes.',
      );
    }
    await this.userRepository.updateUser(unVerifiedUser?.username, {
      verified: true,
    });
    return { message: 'User successfully verified.' };
  }

  async setRestPasswordToken(body: SetResetPasswordToken) {
    const user = await this.userRepository.findByEmail(body?.email);
    const tokenData = await this.userRepository.getToken(
      body?.email,
      TokenType.RESET_PASSWORD,
    );

    if (!user) {
      throw new BadRequestException('User with this email doesnot exist.');
    }
    if (tokenData?.token) {
      throw new UnprocessableEntityException(
        `Reset Password link is already sent, please check your inbox or try again in 5 minutes`,
      );
    }
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userRepository.setToken(
      user?.email,
      TokenType.RESET_PASSWORD,
      token,
    );
    return {
      ...user.toJSON(),
      token: token,
    };
  }

  async resetPasswordWithToken(body: ResetPasswordWithToken) {
    const user = await this.userRepository.findByEmail(body?.email);
    const tokenData = await this.userRepository.getToken(
      body?.email,
      TokenType.RESET_PASSWORD,
    );
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    if (!tokenData || !tokenData?.token) {
      throw new UnprocessableEntityException(
        `Reset Password link expired, please try again in 5 minutes.`,
      );
    }
    if (tokenData?.token !== body?.token) {
      throw new BadRequestException(
        `Something went wrong, try again after 5 minutes.`,
      );
    }
    await this.userRepository.resetPassword(user?.username, body?.password);
    return { message: 'Password changed successfully.' };
  }

  async uploadProfile(username: string, body: UploadProfile) {
    await this.userRepository.uploadProfile(
      username,
      body?.filename,
      body?.url,
    );
    return { message: 'Profile picture updated.' };
  }

  async validateUser(body: ValidateUser) {
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

  async resetPassword(body: ResetPassword, user: CurrentUserType) {
    await this.userRepository.resetPassword(user?.username, body?.password);
    return { message: 'Password changed successfully.' };
  }

  async verifyUser(request: VerfiyUser) {
    const user = await this.userRepository.findByUsername(request?.username);
    if (!user) {
      throw new UnprocessableEntityException("User doesn't exists.");
    }
    return {
      username: user?.username,
      userID: user?._id,
      verified: user?.verified,
      email: user?.email
    };
  }

  private async userExist(request: VerfiyUser) {
    const user = await this.userRepository.findByUsername(request?.username);
    if (user) {
      throw new UnprocessableEntityException('User already exists.');
    }
  }
}
