import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CronService } from './cron.service';




@ApiTags('定时任务')
@Controller('request')
export class CronController {
    constructor(private cronService: CronService) { }

    @Get('random')
    async getRandomQuote() {
        return this.cronService.handleCron();
    }
}

