import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../common/entity/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../common/entity/task.entity';
import { Group } from '../../common/entity/group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { SubItem } from '../../common/entity/sub-item.entity'
import { Message } from '../../common/entity/message.entity';
import { Note } from '../../common/entity/note.entity';
import { Picture } from '../../common/entity/picture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task,User,Group,SubItem,Message, Note,Picture]),
    UserModule,
  ],
  providers: [TaskService,GroupService],
  controllers: [TaskController,GroupController]
})
export class TaskModule { }
