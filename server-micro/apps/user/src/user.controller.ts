import {
  BadRequestException,
  Controller,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthRMQRequest,
  AuthRouteRequest,
  ClientExceptionFilter,
  CurrentUser,
  CurrentUserType,
  RMQRequest,
  RequestMethods,
} from '@app/common';
import { RequestValidator } from '@app/common';
import {
  Contacts,
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
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller()
@UseFilters(new ClientExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Post Routes
  @MessagePattern(RequestMethods.POST)
  @UseGuards(JwtAuthGuard)
  async postUser(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRouteRequest,
  ) {
    let validation: any;
    switch (payload?.route) {
      case 'update':
        validation = await RequestValidator(UpdateUser, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.userService.updateUser(payload?.data, user);
        break;
      case 'reset-password':
        validation = await RequestValidator(ResetPassword, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.userService.resetPassword(payload?.data, user);
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Get Routes
  @MessagePattern(RequestMethods.GET)
  @UseGuards(JwtAuthGuard)
  async getUser(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRouteRequest,
  ) {
    switch (payload?.route) {
      case 'profile':
        return await this.userService.userProfile(user);
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Delete Routes
  @MessagePattern(RequestMethods.DELETE)
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRouteRequest,
  ) {
    switch (payload?.route) {
      case 'delete':
        return await this.userService.deleteUser(user, payload?.Authentication);
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Events
  @MessagePattern('createUser')
  async createUser(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(CreateUser, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.createUser(payload?.data);
  }

  @MessagePattern('uploadProfile')
  @UseGuards(JwtAuthGuard)
  async uploadProfile(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRMQRequest,
  ) {
    const validation = await RequestValidator(UploadProfile, payload.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.uploadProfile(user?.username, payload?.data);
  }

  @MessagePattern('validateUser')
  async validateUser(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(ValidateUser, payload.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.validateUser(payload?.data);
  }

  @MessagePattern('verifyUser')
  @UseGuards(JwtAuthGuard)
  async verifyUser(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRMQRequest,
  ) {
    const validation = await RequestValidator(VerfiyUser, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await user;
  }

  @MessagePattern('getContacts')
  @UseGuards(JwtAuthGuard)
  async getContacts(@Payload() payload: AuthRMQRequest) {
    const validation = await RequestValidator(Contacts, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.getUsers(payload?.data?.contacts);
  }

  @MessagePattern('getUser')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@CurrentUser() user: CurrentUserType) {
    return await this.userService.userProfile(user);
  }

  @MessagePattern('setEmailToken')
  async setVerfiyToken(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(SetEmailToken, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.setEmailToken(payload?.data);
  }

  @MessagePattern('verifyEmailToken')
  async verfiyToken(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(VerifyEmailToken, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await this.userService.verfiyEmailToken(payload?.data);
  }

  @MessagePattern('setRestPasswordToken')
  async setRestPasswordToken(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(
      SetResetPasswordToken,
      payload?.data,
    );
    if (validation) throw new BadRequestException(validation);
    return await this.userService.setRestPasswordToken(payload?.data);
  }

  @MessagePattern('resetPasswordWithToken')
  async resetPasswordWithToken(@Payload() payload: RMQRequest) {
    const validation = await RequestValidator(
      ResetPasswordWithToken,
      payload?.data,
    );
    if (validation) throw new BadRequestException(validation);
    return await this.userService.resetPasswordWithToken(payload?.data);
  }
}
