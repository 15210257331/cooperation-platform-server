import { Controller, Get, Redirect, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@ApiTags('接口服务主页面')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  public root() {
    return {
      title: 'cooperation-platform 协作平台项目后端服务',
      link: '点击查看接口文档详情'
    };
  }
}
