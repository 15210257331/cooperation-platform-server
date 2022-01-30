import { Controller, Get, Query } from '@nestjs/common';
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

    @Get('weather')
    async weatherData(@Query('location') location: any) {
        return this.requestService.weatherData(location);
    }

    @Get('cityInfo')
    async cityInfo(@Query('location') location: any) {
        return this.requestService.cityInfo(location);
    }
}

