import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDetail } from './entity/notification-detail.entity';
import { Notification } from './entity/notification.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Notification, NotificationDetail,]),
        UserModule,
        WebsocketModule,
    ],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule { }
