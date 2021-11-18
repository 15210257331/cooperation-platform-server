import { Injectable, Module } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

const randomQuoteApi = 'http://api.quotable.io/random';

@Injectable()
export class CronService {

    constructor() { }

    @Cron('5 * * * * *')
    handleCron() {
        console.log('每一分钟打印这一条信息');
    }

}