import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { NotificationDetail } from '../notification/entity/notification-detail.entity';
import { Flow } from '../flow/entities/flow.entity';
import { Notification } from '../notification/entity/notification.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { Tag } from '../tag/entities/tag.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      User,
      Notification,
      NotificationDetail,
      Flow,
      Tag
    ]),
    UserModule,
    TagModule,
    AuthModule,
    NotificationModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
