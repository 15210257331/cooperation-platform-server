import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task,User]),
    UserModule
  ],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule { }
