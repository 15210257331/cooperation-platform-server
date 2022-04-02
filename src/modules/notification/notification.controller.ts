import { Controller, Get, UseGuards, Post, Body,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';




@ApiTags('名言名句')
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    //任务消息列表
    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Request() request: any): Promise<any> {
        return this.notificationService.list(request);
    }

    //任务消息列表
    @Post('/read')
    @UseGuards(AuthGuard('jwt'))
    public async read(@Body() body: { ids: number[], }): Promise<any> {
        return this.notificationService.read(body);
    }
}

