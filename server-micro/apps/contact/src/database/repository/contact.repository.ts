import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../schema/contact.schema';
import { ContactStatus } from '@app/common';
@Injectable()
export class ContactRepository {
  protected readonly logger = new Logger(ContactRepository.name);

  constructor(
    @InjectModel(Contact.name) public readonly contactModel: Model<Contact>,
  ) {}

  async getContacts(username: string): Promise<Contact[]> {
    return await this.contactModel
      .find({
        $or: [
          {
            sender: username,
            status: { $in: [ContactStatus.FRIENDS, ContactStatus.ACCEPTED] },
          },
          {
            receiver: username,
            status: { $in: [ContactStatus.FRIENDS, ContactStatus.ACCEPTED] },
          },
        ],
      })
      .exec();
  }

  async checkContacts(
    username1: string,
    username2: string,
  ): Promise<Contact[]> {
    return await this.contactModel
      .find({
        $or: [
          { sender: username1, receiver: username2 },
          { sender: username2, receiver: username1 },
        ],
      })
      .exec();
  }

  async checkContact(
    username1: string,
    username2: string,
  ): Promise<Contact | null> {
    return await this.contactModel
      .findOne({ sender: username1, receiver: username2 })
      .exec();
  }

  async createContact(sender: string, receiver: string, status: ContactStatus) {
    const newUser = new this.contactModel({
      sender,
      receiver,
      status,
    });
    return await newUser.save();
  }

  async deleteUserContact(username: string) {
    await this.contactModel
      .find({
        $or: [{ sender: username }, { receiver: username }],
      })
      .deleteMany()
      .exec();
  }

  async updateContact(
    username: string,
    contactUsername: string,
    status: ContactStatus,
  ) {
    await this.contactModel
      .findOneAndUpdate(
        { sender: username, receiver: contactUsername },
        { status: status },
        { new: true },
      )
      .exec();
  }

  async deleteContact(username: string, contactUsername: string) {
    await this.contactModel
      .find({
        $or: [
          { sender: username, receiver: contactUsername },
          { sender: contactUsername, receiver: username },
        ],
      })
      .deleteMany()
      .exec();
  }
}
