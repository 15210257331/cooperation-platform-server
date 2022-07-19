import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('消息通知')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  //任务消息列表
  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(
    @Request() request: any,
    @Query() query: any,
  ): Promise<any> {
    return this.notificationService.list(request, query);
  }

  // 未读消息数量
  @Get('/unreadCount')
  @UseGuards(AuthGuard('jwt'))
  public async unreadCount(@Request() request: any): Promise<any> {
    return this.notificationService.unreadCount(request);
  }

  //消息标记已读
  @Post('/read')
  @UseGuards(AuthGuard('jwt'))
  public async read(@Body() body: { id: number }): Promise<any> {
    return this.notificationService.read(body);
  }
}
