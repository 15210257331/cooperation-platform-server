import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationDetail } from '../notification/entity/notification-detail.entity';
import { Notification } from '../notification/entity/notification.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { Task } from '../task/entities/task.entity';
import { IterationController } from './iteration.controller';
import { Project } from '../project/entities/project.entity';
import { Iteration } from './entities/iteration.entity';
import { IterationService } from './iteration.service';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Iteration,
      Notification,
      Task,
      User,
      NotificationDetail,
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [IterationService],
  controllers: [IterationController],
})
export class IterationModule {}
