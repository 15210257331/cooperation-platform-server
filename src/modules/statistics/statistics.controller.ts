/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Body, UseGuards, Post, UsePipes, Delete, Param, Request, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('统计相关接口')
@Controller('/statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsService: StatisticsService
    ) { }

    // 访问主页埋点
    @Post('/addVisit')
    @UseGuards(AuthGuard('jwt'))
    public async addVisit(@Body() body: any): Promise<any> {
        return this.statisticsService.addVisit(body);
    }

    // 访问数据统计
    @Get('/visitCount')
    @UseGuards(AuthGuard('jwt'))
    public async visitCount(): Promise<any> {
        return this.statisticsService.visitCount();
    }

    // 统计数据-用户排行top5
    @Get('/userRank')
    @UseGuards(AuthGuard('jwt'))
    public async userRank(@Query('type', new ParseIntPipe()) type: number): Promise<any> {
        return this.statisticsService.userRank(type);
    }

    // 统计数据-任务完成趋势
    @Get('/taskTrend')
    @UseGuards(AuthGuard('jwt'))
    public async taskTrend(@Query('type', new ParseIntPipe()) type: number): Promise<any> {
        return this.statisticsService.taskTrend(type);
    }
}
