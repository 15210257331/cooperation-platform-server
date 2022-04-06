import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../task/entity/task.entity';
import { CronService } from './cron.service';
import { SocketModule } from '../socket/socket.module';

@Module({
    providers: [CronService,],
    imports: [
        TypeOrmModule.forFeature([Task]),
        ScheduleModule.forRoot(),
        SocketModule
    ],
    controllers: [],
})
export class CronModule { }
