import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { SubItem } from './entity/sub-item.entity'
import { MessageDetail } from '../message/entity/message-detail.entity';
import { Note } from '../note/entity/note.entity';
import { Picture } from './entity/picture.entity';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entity/flow.entity';
import { Message } from '../message/entity/message.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, SubItem, Message,MessageDetail, Note, Picture, Flow]),
    UserModule,
    MessageModule
  ],
  providers: [TaskService, FlowService],
  controllers: [TaskController, FlowController]
})
export class TaskModule { }
