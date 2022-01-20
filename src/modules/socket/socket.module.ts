import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from '../socket/events.gateway';

@Module({
    providers: [EventsGateway],
    controllers: [],
    exports: [EventsGateway]
})
export class SocketModule { }
