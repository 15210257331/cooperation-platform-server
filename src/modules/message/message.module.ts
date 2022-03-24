import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageDetail } from '../../entity/message-detail.entity';
import { Message } from '../../entity/message.entity';
import { User } from '../../entity/user.entity';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Message, MessageDetail,]),
        UserModule,
        SocketModule,
    ],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService]
})
export class MessageModule { }
