import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ContactStatus, ContactType } from '@app/common';
import { ContactRepository } from './database/repository/contact.repository';
import { Contact } from './database/schema/contact.schema';
import { UserService } from '../user/user.service';
import { ChatRepository } from '../chat/database/repository/chat.repository';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async sendRequest(userID: string, contactID: string) {
    await this.checkUserExist(contactID);
    const records = await this.contactRepository.checkContacts(
      userID,
      contactID,
    );
    if (records.length > 0) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.createContact(
      userID,
      contactID,
      ContactStatus.SENT,
    );

    // Notify Users
    await this.notifyUsers('send-request', userID, contactID);

    return { message: 'Friend request sent.' };
  }

  async cancelRequest(
    userID: string,
    contactID: string,
    command: 'cancelled' | 'rejected',
  ) {
    await this.checkUserExist(contactID);
    const records = await this.contactRepository.checkContacts(
      userID,
      contactID,
    );
    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    let isExist: Contact;
    if (command === 'cancelled') {
      isExist = await this.contactRepository.checkContact(userID, contactID);
    } else {
      isExist = await this.contactRepository.checkContact(contactID, userID);
    }
    if (
      !isExist ||
      (isExist.status !== ContactStatus.SENT &&
        isExist.status !== ContactStatus.RECEIVED)
    ) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.deleteContact(contactID, userID);

    // Notify users
    let status;
    if (command === 'cancelled') {
      status = 'cancel-request';
    } else {
      status = 'decline-request';
    }
    await this.notifyUsers(status, userID, contactID);

    return { message: `Friend request ${command}.` };
  }

  async acceptRequest(userID: string, contactID: string) {
    await this.checkUserExist(contactID);
    const records = await this.contactRepository.checkContacts(
      userID,
      contactID,
    );

    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    const isExist = await this.contactRepository.checkContact(
      contactID,
      userID,
    );
    if (
      !isExist ||
      (isExist.status !== ContactStatus.SENT &&
        isExist.status !== ContactStatus.RECEIVED)
    ) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.updateContact(
      contactID,
      userID,
      ContactStatus.ACCEPTED,
    );

    // Notify Users
    await this.notifyUsers('accept-request', userID, contactID);

    return { message: 'Friend request accepted.' };
  }

  async seenContact(
    userID: string,
    contactID: string,
    contactType: ContactType,
    status: ContactStatus,
  ) {
    await this.checkUserExist(contactID);
    let existContact;
    if (contactType === ContactType.SENDER) {
      existContact = await this.contactRepository.checkContact(
        contactID,
        userID,
      );
    } else {
      existContact = await this.contactRepository.checkContact(
        userID,
        contactID,
      );
    }
    if (!existContact || existContact.status !== status) {
      throw new BadRequestException('Bad Request');
    }
    if (contactType === ContactType.SENDER) {
      await this.contactRepository.updateContact(
        contactID,
        userID,
        status === ContactStatus.ACCEPTED
          ? ContactStatus.FRIENDS
          : ContactStatus.RECEIVED,
      );
    } else {
      await this.contactRepository.updateContact(
        userID,
        contactID,
        status === ContactStatus.ACCEPTED
          ? ContactStatus.FRIENDS
          : ContactStatus.RECEIVED,
      );
    }
    return { message: 'Contact status updated.' };
  }

  async removeContact(userID: string, contactID: string) {
    await this.checkUserExist(contactID);
    const records = await this.contactRepository.checkContacts(
      userID,
      contactID,
    );
    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    if (
      records[0].status !== ContactStatus.ACCEPTED &&
      records[0].status !== ContactStatus.FRIENDS
    ) {
      throw new BadRequestException('Bad Request');
    }

    await this.contactRepository.deleteContact(userID, contactID);

    // Delete Messages between them
    const roomID = this.chatRepository.generateRoomIDs(userID, contactID);
    await this.chatRepository.jsonDel(`rooms:${roomID}`);

    // Notify Users
    await this.notifyUsers('remove-request', userID, contactID);

    return { message: 'Removed contact successfully.' };
  }

  async getContacts(userID: string) {
    const contacts = (await this.contactRepository.getContacts(userID)).map(
      (contact: Contact) => {
        if (contact?.sender?.toString() === userID) {
          return {
            userID: contact?.receiver,
            status: contact?.status,
            type: ContactType.RECEIVER,
          };
        } else {
          return {
            userID: contact?.sender,
            status: contact?.status,
            type: ContactType.SENDER,
          };
        }
      },
    );
    if (!contacts || contacts.length === 0) {
      return { contacts: [] };
    }
    const contactIDs = contacts.flatMap((contact) => contact?.userID);
    const result = [
      ...(await this.userService.getUsers(contactIDs)).map((contact) => {
        const contactJSON = contact.toJSON();
        const list = contacts.find(
          (user) => user?.userID?.toString() === contactJSON?._id?.toString(),
        );
        if (list) {
          return {
            ...contactJSON,
            ...list,
          };
        }
        return contactJSON;
      }),
    ];
    return { contacts: result };
  }

  async deleteUserContact(userID: string) {
    await this.checkUserExist(userID);
    const contactIDs = (
      await this.contactRepository.getContacts(userID)
    )?.flatMap((contact) => {
      if (contact?.sender.toJSON() === userID) {
        return contact?.receiver.toJSON();
      } else {
        return contact?.sender.toJSON();
      }
    });
    for (let i = 0; i < contactIDs.length; i++) {
      // notify contact
      await this.notifyUsers('account-deleted', userID, contactIDs[i]);
      const roomID = this.chatRepository.generateRoomIDs(userID, contactIDs[i]);
      await this.chatRepository.jsonDel(`rooms:${roomID}`);
    }
    await this.contactRepository.deleteUserContact(userID);
    return { message: 'Contact successfully deleted.' };
  }

  private async checkUserExist(contactID: string) {
    const isExist = await this.userService.getUser(contactID);
    if (isExist?._id?.toString() !== contactID) {
      throw new BadRequestException('Bad Request');
    }
  }

  private async notifyUsers(status: string, userID: string, contactID: string) {
    await this.chatRepository.publish(
      'contact',
      JSON.stringify({
        type: 'contact',
        data: {
          status,
          userID,
          contactID,
        },
      }),
    );
  }
}
