import {
  BadRequestException,
  Controller,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthRMQRequest,
  ClientExceptionFilter,
  CurrentUser,
  CurrentUserType,
  RMQRequest,
  RequestMethods,
  RouteRequest,
} from '@app/common';
import { RequestValidator } from '@app/common';
import {
  Login,
  Register,
  ResetPassword,
  ResetPasswordLink,
  VerifyEmailLink,
} from './dto/auth.request';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';
import { VerifyEmail } from './dto/auth.request';

@Controller()
@UseFilters(new ClientExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post Routes
  @MessagePattern(RequestMethods.POST)
  async postAuth(@Payload() payload: RouteRequest) {
    let validation: any;
    switch (payload?.route) {
      case 'login':
        validation = await RequestValidator(Login, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.login(payload?.data);
        break;
      case 'register':
        validation = await RequestValidator(Register, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.register(payload?.data);
        break;
      case 'reset-password-link':
        validation = await RequestValidator(ResetPasswordLink, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.sendResetPasswordLink(payload?.data);
        break;
      case 'reset-password':
        validation = await RequestValidator(ResetPassword, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.resetPassword(payload?.data);
        break;
      case 'verify-email-link':
        validation = await RequestValidator(VerifyEmailLink, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.sendVerificationEmail(payload?.data);
        break;
      case 'verify-email':
        validation = await RequestValidator(VerifyEmail, payload.data);
        if (validation) throw new BadRequestException(validation);
        return await this.authService.verifyEmailToken(payload?.data);
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Events
  @MessagePattern('refresh')
  @UseGuards(RefreshJwtGuard)
  async refresh(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRMQRequest,
  ) {
    return await this.authService.refresh(user, payload?.data.refresh);
  }

  @MessagePattern('logout')
  async createUser(@Payload() payload: RMQRequest) {
    return await this.authService.logout(payload?.data);
  }
}
