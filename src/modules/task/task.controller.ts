/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UsePipes,
  ParseBoolPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

@ApiTags('任务相关接口')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //所有任务列表
  @Post('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(@Body() body: any, @Request() request: any): Promise<any> {
    return this.taskService.list(body, request);
  }

  //新增任务
  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  public async taskAdd(
    @Body() taskAddDTO: TaskAddDTO,
    @Request() request: any,
  ): Promise<any> {
    return this.taskService.create(taskAddDTO, request);
  }

  // 更新任务单一属性
  @Post('/updateProps')
  @UseGuards(AuthGuard('jwt'))
  public async updateProps(@Body() body: any): Promise<any> {
    return this.taskService.updateProps(body);
  }

  // 任务详情
  @Get('/detail')
  @UseGuards(AuthGuard('jwt'))
  public async detail(@Query('taskId') taskId: number): Promise<any> {
    return this.taskService.detail(taskId);
  }

  // 删除任务
  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @Transaction()
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @TransactionManager() maneger: EntityManager,
  ): Promise<any> {
    return this.taskService.delete(id, maneger);
  }

  // 任务完成趋势
  @Get('/trend')
  @UseGuards(AuthGuard('jwt'))
  public async trend(
    @Query('type', new ParseIntPipe()) type: number,
  ): Promise<any> {
    return this.taskService.trend(type);
  }
}
