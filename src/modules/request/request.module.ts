import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
    imports: [HttpModule],
    providers: [RequestService],
    controllers: [RequestController],
})
export class RequestModule { }
