import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export type AuthPayload = {
  userID: string;
};

export type SocketWithAuth = Socket & AuthPayload;

export type SocketIOAuthMiddleware = {
  (client: SocketWithAuth, next: (err?: Error) => void);
};

export const socketIOAuthMiddleware =
  (
    jwtService: JwtService,
    logger: Logger,
    config: ConfigService,
  ): SocketIOAuthMiddleware =>
  (socket: SocketWithAuth, next) => {
    const handleSocketConnection = async (socket: SocketWithAuth, next) => {
      const token = socket.handshake.query.token as string;
      // socket.handshake.auth.token || socket.handshake.headers['token'];

      // logger.debug(`Validating auth token before connection: ${token}`);

      try {
        const payload = jwtService.verify(token, {
          secret: config.get<string>('JWT_SECRET'),
        });

        // const currentTime = Date.now() / 1000;  || (payload.exp && payload.exp < currentTime)
        if (!payload?.userID || !payload?.verified) {
          throw new UnauthorizedException();
        }
        socket.userID = payload?.userID;
        next();
      } catch (error) {
        next(error);
      }
    };

    handleSocketConnection(socket, next);
  };
