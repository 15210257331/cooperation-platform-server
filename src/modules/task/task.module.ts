import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { SubItem } from './entity/sub-item.entity'
import { NotificationDetail } from '../notification/entity/notification-detail.entity';
import { Picture } from './entity/picture.entity';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entity/flow.entity';
import { Notification } from '../notification/entity/notification.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, SubItem, Notification,NotificationDetail, Picture, Flow]),
    UserModule,
    NotificationModule
  ],
  providers: [TaskService, FlowService],
  controllers: [TaskController, FlowController]
})
export class TaskModule { }
