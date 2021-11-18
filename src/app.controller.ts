import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@ApiTags('主应用')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Redirect('/doc', 302)
  getHello(): string {
    return this.appService.getHello();
  }
}
