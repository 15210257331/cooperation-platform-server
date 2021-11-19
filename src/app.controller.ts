import { Controller, Get, Redirect, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@ApiTags('主应用')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/')
  // @Redirect('/doc', 302)
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  @Render('index')
  root() {
    return { 
      title: '这是一个Nice todo 的服务端接口文档',
      link: '点击查看详情'
    };
  }
}
