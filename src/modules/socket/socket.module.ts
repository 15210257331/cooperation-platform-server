import { Module } from '@nestjs/common';
import { EventsGateway } from '../socket/events.gateway';

@Module({
    providers: [EventsGateway],
    controllers: [],
    exports: [EventsGateway]
})
export class SocketModule { }
