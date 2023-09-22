import { Injectable } from '@nestjs/common';
import { ChatRepository } from './database/repository/chat.repository';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { Message, SocketWithAuth } from './utils/variables';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async addUserOnline(userID: string, socketID: string) {
    this.chatRepository.set(userID, socketID, 60);
  }

  async removeUserOnline(userID: string) {
    this.chatRepository.del(userID);
  }

  async activeUsers(contactIDs: string[]): Promise<any> {
    const contacts = [];

    for (let i = 0; i < contactIDs.length; i++) {
      const id = contactIDs[i].toString();

      const socketID = await this.chatRepository.get(id);
      const res = {
        id,
        socketID: socketID,
        isOnline: socketID ? true : false,
      };
      contacts.push(res);
    }
    return contacts;
  }

  async connectUserChannels(
    userID: string,
    client: SocketWithAuth,
    contactIDs: string[],
  ) {
    const roomIDs = await this.getRoomIDs(userID, contactIDs);
    roomIDs.forEach((roomID) => client.join(roomID));
  }

  async getUserMessages(userID: string, contactIDs: string[]): Promise<any[]> {
    const roomIDs = await this.getRoomIDs(userID, contactIDs);
    const messages = [];
    for (let i = 0; i < roomIDs.length; i++) {
      const message = (await this.chatRepository.jsonGet(
        `rooms:${roomIDs[i]}`,
      )) as string;
      messages.push({
        roomID: roomIDs[i],
        messages: message ? message : '[]',
      });
    }
    return messages;
  }

  async userTyping(data: Partial<Message>) {
    await this.chatRepository.publish('user-typing', JSON.stringify(data));
  }

  async sendMessage(data: Partial<Message>) {
    data.messageID = uuidv4();
    const roomID = await this.chatRepository.generateRoomIDs(
      data?.senderID,
      data?.receiverID,
    );
    const room = `rooms:${roomID}`;
    this.chatRepository.jsonArraySetOrAppend(room, data);
    await this.chatRepository.publish('user-message', JSON.stringify(data));
  }

  async receiveMessage(server: Server, message: Partial<Message>) {
    const roomID = await this.chatRepository.generateRoomIDs(
      message?.senderID,
      message?.receiverID,
    );
    server.to(roomID).emit('receive-message', message);
  }

  async typingMessage(server: Server, message: Partial<Message>) {
    const roomID = await this.chatRepository.generateRoomIDs(
      message?.senderID,
      message?.receiverID,
    );
    server.to(roomID).emit('typing', message);
  }

  async messageStatus(room: any) {
    if (room.messageID.length == 0) {
      this.chatRepository.jsonSet(
        `rooms:${room?.roomID}`,
        room?.crntStatus,
        `$[?(@.status=='${room?.prevStatus}'&&@.senderID!='${room?.userID}')].status`,
      );
    } else {
      room?.messageID.forEach((msgID: string) => {
        this.chatRepository.jsonSet(
          `rooms:${room?.roomID}`,
          room?.crntStatus,
          `$[?(@.messageID=='${msgID}')].status`,
        );
      });
    }
    this.chatRepository.publish('message-status', JSON.stringify(room));
  }

  async updateStatus(server: Server, room: any) {
    server.to(room.roomID).emit('update-status', room);
  }

  async getRoomIDs(userID: string, contactIDs: string[]): Promise<string[]> {
    const contacts = [];
    for (let i = 0; i < contactIDs.length; i++) {
      contacts.push(this.chatRepository.generateRoomIDs(userID, contactIDs[i]));
    }
    return contacts;
  }
}
