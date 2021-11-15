import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../role/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Group } from './group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task,User,Group]),
    UserModule
  ],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule { }
