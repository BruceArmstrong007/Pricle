import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiExceptionFilter, CurrentUser, CurrentUserType } from '@app/common';
import { Contact, SeenContact } from './dto/contact.request';

@Controller('contact')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApiExceptionFilter())
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send-request')
  async refreshToken(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Contact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.sendRequest(user?.userID, body?.contactID);
  }

  @Post('cancel-request')
  async cancelRequest(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Contact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.cancelRequest(
      user?.userID,
      body?.contactID,
      'cancelled',
    );
  }

  @Post('accept-request')
  async acceptRequest(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Contact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.acceptRequest(
      user?.userID,
      body?.contactID,
    );
  }

  @Post('decline-request')
  async declineRequest(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Contact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.cancelRequest(
      user?.userID,
      body?.contactID,
      'rejected',
    );
  }

  @Post('remove-contact')
  async removeContact(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Contact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.removeContact(
      user?.userID,
      body?.contactID,
    );
  }

  @Post('seen-contact')
  async seenContact(
    @CurrentUser() user: CurrentUserType,
    @Body() body: SeenContact,
  ) {
    this.contactVaidation(user?.userID, body?.contactID);
    return await this.contactService.seenContact(
      user?.userID,
      body?.contactID,
      body?.type,
      body?.status
    );
  }

  @Get('fetch')
  async getContacts(@CurrentUser() user: CurrentUserType) {
    return await this.contactService.getContacts(user?.userID);
  }

  contactVaidation(username, contactUsername) {
    if (username === contactUsername) {
      throw new BadRequestException('Bad Request');
    }
  }
}
