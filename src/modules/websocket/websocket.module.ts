import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websoket.gateway';

@Module({
  providers: [WebsocketGateway],
  controllers: [],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
