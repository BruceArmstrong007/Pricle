import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';
import { Server } from 'socket.io';
import { ChatRepository } from '../../database/repository/chat.repository';
import { SocketWithAuth } from '../../middleware/ws-auth.middleware';

@WebSocketGateway({ namespace: 'message' })
export class MessageGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly chatRepository: ChatRepository,
  ) {
    // Subscribes to the Message event emitted by user through redisIO
    // And emits to specific room and store it in redis db as well
    this.chatRepository.subscribe('user-message', async (data: string) => {
      this.chatService.receiveMessage(this.server, JSON.parse(data));
    });

    // Subscribes to the Typing event emitted by user through redisIO
    // And emits to specific room
    this.chatRepository.subscribe('user-typing', async (data: string) => {
      this.chatService.typingMessage(this.server, JSON.parse(data));
    });

    // Subscribes to the message status event emitted by user through redisIO
    // And emits to specific room
    this.chatRepository.subscribe('message-status', async (data: string) => {
      this.chatService.updateStatus(this.server, JSON.parse(data));
    });
  }

  // Send all the user messages in response
  @SubscribeMessage('get-messages')
  async getMessages(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: any,
  ): Promise<any> {
    await this.chatService.connectUserChannels(
      client.userID,
      client,
      data?.contactIDs,
    );
    return await this.chatService.getUserMessages(
      client.userID,
      data?.contactIDs,
    );
  }

  // Send messages to all the friend rooms user is connected
  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() data: any) {
    await this.chatService.sendMessage(data);
  }

  // Send messages to all the friend rooms user is connected
  @SubscribeMessage('user-typing')
  async typing(@MessageBody() data: any) {
    await this.chatService.userTyping(data);
  }

  @SubscribeMessage('message-status')
  async updateMsgStatus(@MessageBody() data: any) {
    await this.chatService.messageStatus(data);
  }
}
