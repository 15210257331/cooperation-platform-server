import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'

export interface WebSocketUser {
  [key: string]: any;
}
@WebSocketGateway(4300, {
  cors: true,
  origins: '*'
})
export class EventsGateway {

  // 保存已经连接上websocket服务的用户集合
  users: WebSocketUser = {};

  @WebSocketServer() server;

  // 新用户连接至websocket
  @SubscribeMessage('new user')
  newUser(client: any, userId: number): Observable<WsResponse<any>> | any {
    // console.log('new user');
    const keys = Object.keys(this.users);
    if (userId && keys.indexOf(String(userId)) < 0) {
      this.users[userId] = client;
    }
  }

  @SubscribeMessage('private message')
  handleEvent(client: any, payload: any): Observable<WsResponse<any>> | any {
    // 消息接收人ID
    const receiveId = String(payload.receiveId);
    // 对方在线直接发送过去
    if (this.users[receiveId]) {
      console.log('在线直接发送');
      this.users[receiveId].emit('private message', payload);
      // return of({
      //   event: 'private message',
      //   payload: payload
      // })
      // 如果不在线不发送存数据库等上线再发送
    } else {
      // await Message.create(msg);
    }
  }

}