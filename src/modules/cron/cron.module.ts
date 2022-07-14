import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../task/entities/task.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { CronService } from './cron.service';

@Module({
    providers: [CronService,],
    imports: [
        TypeOrmModule.forFeature([Task]),
        ScheduleModule.forRoot(),
        WebsocketModule
    ],
    controllers: [],
})
export class CronModule { }
