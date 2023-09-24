import {
  Controller,
  Post,
  UseFilters,
  UseGuards,
  Get,
  Delete,
  Body,
  Query,
  BadGatewayException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExceptionFilter, CurrentUser, CurrentUserType } from '@app/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ChangeEmail,
  ChangeEmailLink,
  ResetPassword,
  UpdateUser,
} from './dto/user.request';
import { Response } from 'express';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApiExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async userProfile(@CurrentUser() user: CurrentUserType) {
    return await this.userService.userProfile(user);
  }

  
  @Get('logout')
  async logout(@Res() response: Response) {
    await this.userService.logout(response);
  }

  @Get('search-users')
  async searchUsers(
    @Query('name') name: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    if (!name) {
      throw new BadGatewayException('Bad Request');
    }
    return await this.userService.searchUsers(name, user?.username);
  }

  @Delete('delete')
  async deleteUser(@CurrentUser() user: CurrentUserType) {
    return await this.userService.deleteUser(user);
  }

  @Post('update')
  async refreshToken(
    @CurrentUser() user: CurrentUserType,
    @Body() body: UpdateUser,
  ) {
    return await this.userService.updateUser(body, user?.userID);
  }

  @Post('reset-password')
  async resetPassword(
    @CurrentUser() user: CurrentUserType,
    @Body() body: ResetPassword,
  ) {
    return await this.userService.resetPassword(body, user?.username);
  }

  @Post('change-email-link')
  async changeEmailLink(
    @CurrentUser() user: CurrentUserType,
    @Body() body: ChangeEmailLink,
  ) {
    return await this.userService.changeEmailLink(user, body?.email);
  }

  @Post('change-email')
  async changeEmail(
    @CurrentUser() user: CurrentUserType,
    @Body() body: ChangeEmail,
  ) {
    return await this.userService.changeEmailVerification(
      user,
      body?.email,
      body?.token,
    );
  }

}
