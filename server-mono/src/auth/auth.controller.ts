import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
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

@Controller('auth')
@UseFilters(new ApiExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User) {
    return await this.authService.login(user);
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

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@CurrentUser() user: CurrentUserType) {
    return await this.authService.refresh(user);
  }
}
