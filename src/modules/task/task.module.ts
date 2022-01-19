import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../common/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../common/entity/task.entity';
import { SubItem } from '../../common/entity/sub-item.entity'
import { Message } from '../../common/entity/message.entity';
import { Note } from '../../common/entity/note.entity';
import { Picture } from '../../common/entity/picture.entity';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from '../../common/entity/flow.entity';
import { EventsGateway } from '../socket/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, SubItem, Message, Note, Picture, Flow]),
    UserModule,
  ],
  providers: [TaskService, FlowService, EventsGateway],
  controllers: [TaskController, FlowController]
})
export class TaskModule { }
