import {
  Controller,
  Get,
  Body,
  UseGuards,
  Post,
  UsePipes,
  Delete,
  Param,
  Request,
  Query,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  Res,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as urlencode from 'urlencode';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from './project.service';

@ApiTags('部署模块')
@Controller('/project')
export class ProjectController {
  constructor(
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private configService: ConfigService,
  ) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  public async createProject(@Body() data: any): Promise<any> {
    return this.projectService.createProject(data);
  }

  // 获取项目列表
  @Get('/list')
  @UsePipes(ValidationPipe)
  public async getProjectList(@Query() name: string): Promise<any> {
    return this.projectService.getProjectList(name);
  }

   // 开始部署项目
   @Get('/deploy')
   @UsePipes(ValidationPipe)
   public async startDeploy(@Query() id: number): Promise<any> {
     return this.projectService.startDeploy(id);
   }
}
