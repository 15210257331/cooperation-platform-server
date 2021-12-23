import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from '../../utils/events.gateway';
import { Task } from '../../common/entity/task.entity';
import { CronService } from './cron.service';
import { EmailModule } from "../email/email.module"

@Module({
    providers: [CronService, EventsGateway],
    imports: [
        TypeOrmModule.forFeature([Task]),
        ScheduleModule.forRoot(),
        EmailModule
    ],
    controllers: [],
})
export class CronModule { }
