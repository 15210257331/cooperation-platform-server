import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { TaskModule } from './modules/task/task.module';
import { RequestModule } from './modules/request/request.module';
import { CronModule } from './modules/cron/cron.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { EnvironmentModule } from './modules/environment/environment.module';
import { TypeormModule } from './modules/typeorm/typeorm.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { FlowModule } from './modules/flow/flow.module';

@Module({
  imports: [
    EnvironmentModule,
    TypeormModule,
    WebsocketModule,
    UserModule,
    AuthModule,
    FileModule,
    FlowModule,
    TaskModule,
    RequestModule,
    CronModule,
    NotificationModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
