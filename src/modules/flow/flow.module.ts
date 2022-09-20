import { Module } from '@nestjs/common';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { Task } from '../task/entities/task.entity';
import { User } from '../user/entity/user.entity';
import { Flow } from './entities/flow.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User,Flow, Project]),
    AuthModule,
    WebsocketModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [FlowController],
  providers: [FlowService]
})
export class FlowModule {}
