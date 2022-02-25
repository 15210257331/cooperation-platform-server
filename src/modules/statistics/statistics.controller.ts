/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Body, UseGuards, Post, UsePipes, Delete, Param, Request, Query, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('用户相关')
@Controller('/statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ) { }

    // 登录
    @Post('/addVisit')
    public async login(@Body() body: any): Promise<any> {
        return this.statisticsService.addVisit(body);
    }

    // 统计数据
    @Get('/data')
    public async data(): Promise<any> {
        return this.statisticsService.data();
    }
    
    // 统计数据
    @Get('/userRank')
    public async userRank(): Promise<any> {
        return this.statisticsService.userRank();
    }
}
