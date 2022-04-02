import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDetail } from './entity/notification-detail.entity';
import { Notification } from './entity/notification.entity';
import { User } from '../user/entity/user.entity';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Notification, NotificationDetail,]),
        UserModule,
        SocketModule,
    ],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule { }
