import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../common/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../common/entity/task.entity';
import { Group } from '../../common/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task,User,Group]),
    UserModule
  ],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule { }
