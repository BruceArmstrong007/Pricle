import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';
import { Server } from 'socket.io';
import { ChatRepository } from '../../database/repository/chat.repository';
import { SocketWithAuth } from '../../middleware/ws-auth.middleware';

interface ContactNotification {
  type: string;
  data: {
    status: string;
    userID: string;
    contactID: string;
  }
}

@WebSocketGateway({ namespace: 'user' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly chatRepository: ChatRepository,
  ) {
    // Listen to contact api changes and send it to user
    this.chatRepository.subscribe('contact', async (event: string) => {
      this.notificationEvent(JSON.parse(event));
    });
  }

  // Initial Fetching of active online friends from redis periodically
  @SubscribeMessage('online-friends')
  async returnActiveUsers(@MessageBody() data: any): Promise<any> {
    return this.chatService.activeUsers(data?.contactIDs);
  }

  // When user is connected, adds user online to redis db with time to live of 1 minute
  handleConnection(client: SocketWithAuth) {
    this.chatService.addUserOnline(client.userID, client?.id);
  }

  // User will periodically adds them online to redis db with time to live of 1 minute
  @SubscribeMessage('online')
  async online(client: SocketWithAuth) {
    this.chatService.addUserOnline(client.userID, client?.id);
  }

  // When user is disconnected, removes online user from redis
  // And add user to a private room with each of his friends
  handleDisconnect(client: SocketWithAuth) {
    this.chatService.removeUserOnline(client.userID);
  }

  async notificationEvent(event: ContactNotification) {
    const socketID = await this.chatRepository.get(event?.data?.contactID);
    if (socketID) await this.server.to(socketID).emit('notify-contact', event);
  }
}
