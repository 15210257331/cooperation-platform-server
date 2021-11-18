import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestService } from './request.service';




@ApiTags('名言名句')
@Controller('request')
export class RequestController {
    constructor(private requestService: RequestService) { }

    @Get('random')
    async getRandomQuote() {
        return this.requestService.getRandomQuote();
    }
}

