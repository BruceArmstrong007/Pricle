import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExceptionFilter, CurrentUser, CurrentUserType } from '@app/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from '../user/database/schema/user.schema';
import {
  Register,
  ResetPassword,
  ResetPasswordLink,
  VerifyEmail,
  VerifyEmailLink,
} from './dto/auth.request';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';
import { Response } from 'express';

@Controller('auth')
@UseFilters(new ApiExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: User,
  ) {
    return await this.authService.login(user, response);
  }

  @Post('register')
  async register(@Body() payload: Register) {
    return await this.authService.register(payload);
  }

  @Post('verify-email-link')
  async verifyEmailLink(@Body() payload: VerifyEmailLink) {
    return await this.authService.sendVerificationEmail(payload);
  }

  @Post('verify-email')
  async verifyEmail(@Body() payload: VerifyEmail) {
    return await this.authService.verifyEmailToken(payload);
  }

  @Post('reset-password-link')
  async resetPasswordLink(@Body() payload: ResetPasswordLink) {
    return await this.authService.sendResetPasswordLink(payload);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPassword) {
    return await this.authService.resetPassword(payload);
  }

  @Get('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@CurrentUser() user: CurrentUserType) {
    return await this.authService.refresh(user);
  }
}
