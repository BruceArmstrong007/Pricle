import {
  BadRequestException,
  Controller,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  AuthRMQRequest,
  AuthRouteRequest,
  ClientExceptionFilter,
  CurrentUser,
  CurrentUserType,
  RequestMethods,
  RequestValidator,
} from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Contact } from './dto/contact.request';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller()
@UseFilters(new ClientExceptionFilter())
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Post Routes
  @MessagePattern(RequestMethods.POST)
  @UseGuards(JwtAuthGuard)
  async postContact(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRouteRequest,
  ) {
    const route = payload?.route;
    const validation = await RequestValidator(Contact, payload.data);
    if (validation) throw new BadRequestException(validation);
    if (user?.username === payload?.data?.username) {
      throw new BadRequestException('Bad Request');
    }
    switch (route) {
      case 'send-request':
        return await this.contactService.sendRequest(
          user?.username,
          payload?.data?.username,
        );
        break;
      case 'cancel-request':
        return await this.contactService.cancelRequest(
          user?.username,
          payload?.data?.username,
          'cancelled',
        );
        break;
      case 'accept-request':
        return await this.contactService.acceptRequest(
          user?.username,
          payload?.data?.username,
        );
        break;
      case 'decline-request':
        return await this.contactService.cancelRequest(
          user?.username,
          payload?.data?.username,
          'rejected',
        );
        break;
      case 'remove-contact':
        return await this.contactService.removeContact(
          user?.username,
          payload?.data?.username,
        );
        break;
      case 'seen-contact':
        return await this.contactService.seenContact(
          user?.username,
          payload?.data?.username,
        );
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Get Routes
  @MessagePattern(RequestMethods.GET)
  @UseGuards(JwtAuthGuard)
  async getContact(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRouteRequest,
  ) {
    const route = payload?.route;
    switch (route) {
      case 'fetch':
        return await this.contactService.getContacts(
          user?.username,
          payload?.Authentication,
        );
        break;
      default:
        throw new BadRequestException('Route not Found.');
    }
  }

  // Event routes
  @MessagePattern('deleteContact')
  @UseGuards(JwtAuthGuard)
  async deleteContact(
    @CurrentUser() user: CurrentUserType,
    @Payload() payload: AuthRMQRequest,
  ) {
    const validation = await RequestValidator(Contact, payload?.data);
    if (validation) throw new BadRequestException(validation);
    return await this.contactService.deleteUserContact(user?.username);
  }
}
