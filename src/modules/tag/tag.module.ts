import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDetail } from '../notification/entity/notification-detail.entity';
import { Notification } from '../notification/entity/notification.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { Task } from '../task/entities/task.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Project } from '../project/entities/project.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Tag,
      Notification,
      Task,
      NotificationDetail,
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
