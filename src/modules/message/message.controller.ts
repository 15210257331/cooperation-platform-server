import { Controller, Get, UseGuards, Post, Body,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';




@ApiTags('名言名句')
@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) { }

    //任务消息列表
    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Request() request: any): Promise<any> {
        return this.messageService.list(request);
    }

    //任务消息列表
    @Post('/read')
    @UseGuards(AuthGuard('jwt'))
    public async read(@Body() body: { ids: number[], }): Promise<any> {
        console.log(body);
        return this.messageService.read(body);
    }
}

