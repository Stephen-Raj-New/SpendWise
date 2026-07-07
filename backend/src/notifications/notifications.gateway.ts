import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Join a room specific to this user for private notifications
      client.join(`user_${payload.sub}`);
      console.log(`Client connected: ${client.id}, User: ${payload.sub}`);
    } catch (err) {
      console.error('Socket authentication failed');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Example of broadcasting a message
  sendNotificationToUser(userId: string, message: any) {
    this.server.to(`user_${userId}`).emit('notification:new', message);
  }
}
