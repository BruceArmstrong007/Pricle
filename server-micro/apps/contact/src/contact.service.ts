import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ContactStatus, RMQClientService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ContactRepository } from './database/repository/contact.repository';
import { Contact } from './database/schema/contact.schema';
import { map } from 'rxjs';

@Injectable()
export class ContactService {
  constructor(
    @Inject(RMQClientService.CONTACT_USER)
    private readonly userClient: ClientProxy,
    private readonly contactRepository: ContactRepository,
  ) {}

  async sendRequest(username: string, contactUsername: string) {
    const records = await this.contactRepository.checkContacts(
      username,
      contactUsername,
    );
    if (records.length > 0) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.createContact(
      username,
      contactUsername,
      ContactStatus.SENT,
    );
    return { message: 'Friend request sent.' };
  }

  async cancelRequest(
    username: string,
    contactUsername: string,
    command: 'cancelled' | 'rejected',
  ) {
    const records = await this.contactRepository.checkContacts(
      username,
      contactUsername,
    );
    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    let isExist: Contact;
    if (command === 'cancelled') {
      isExist = await this.contactRepository.checkContact(
        username,
        contactUsername,
      );
    } else {
      isExist = await this.contactRepository.checkContact(
        contactUsername,
        username,
      );
    }
    if (!isExist || isExist.status !== ContactStatus.SENT) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.deleteContact(contactUsername, username);
    return { message: `Friend request ${command}.` };
  }

  async acceptRequest(username: string, contactUsername: string) {
    const records = await this.contactRepository.checkContacts(
      username,
      contactUsername,
    );
    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    const isExist = await this.contactRepository.checkContact(
      contactUsername,
      username,
    );
    if (!isExist || isExist.status !== ContactStatus.SENT) {
      throw new BadRequestException('Bad Request');
    }
    await this.contactRepository.updateContact(
      contactUsername,
      username,
      ContactStatus.ACCEPTED,
    );
    return { message: 'Friend request accepted.' };
  }

  async seenContact(username: string, contactUsername: string) {
    const records = await this.contactRepository.checkContacts(
      username,
      contactUsername,
    );
    if (records.length !== 1) {
      throw new BadRequestException('Bad Request');
    }
    const isExist = await this.contactRepository.checkContact(
      contactUsername,
      username,
    );
    if (!isExist || isExist.status !== ContactStatus.ACCEPTED) {
      throw new BadRequestException('Bad Request');
    }

    await this.contactRepository.updateContact(
      contactUsername,
      username,
      ContactStatus.FRIENDS,
    );
    return { message: 'Contact status updated.' };
  }

  async removeContact(username: string, contactUsername: string) {
    const records = await this.contactRepository.checkContacts(
      username,
      contactUsername,
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

    await this.contactRepository.deleteContact(username, contactUsername);
    return { message: 'Removed contact successfully.' };
  }

  async deleteUserContact(username: string) {
    await this.contactRepository.deleteUserContact(username);
    return { message: 'Contact successfully deleted.' };
  }

  async getContacts(username: string, token: string) {
    const contacts = (await this.contactRepository.getContacts(username)).map(
      (contact: Contact) => {
        if (contact?.sender === username) {
          return { username: contact?.receiver, status: contact?.status };
        } else {
          return { username: contact?.sender, status: contact?.status };
        }
      },
    );
    if (!contacts || contacts.length === 0) {
      return { contacts: [] };
    }
    const contactUsernames = contacts.flatMap((contact) => contact?.username);
    return this.userClient
      .send('getContacts', {
        data: { contacts: contactUsernames },
        Authentication: token,
      })
      .pipe(
        map((users) => {
          const result = [
            ...users.map((user) => {
              const userJSON = user.toJSON();
              const list = contacts.find(
                (user) => user?.username === userJSON?.username,
              );
              if (list) {
                return {
                  ...userJSON,
                  ...list,
                };
              }
              return userJSON;
            }),
          ];
          return { contacts: result };
        }),
      );
  }
}
