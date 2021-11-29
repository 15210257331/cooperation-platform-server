/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('任务相关接口')
@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService
    ) { }

    /**
     * 新增任务
     * @param taskAddDTO 
     * @param request 
     * @returns 
     */
    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async taskAdd(@Body() taskAddDTO: TaskAddDTO, @Request() request: any): Promise<any> {
        return this.taskService.taskAdd(taskAddDTO, request);
    }

    /**
     * 删除任务
     * @param id 
     * @returns 
     * 使用了内置的ParseIntPipe管道，可以将id 转换成number类型
     */
    @Get('/delete')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Query('id', new ParseIntPipe()) id: number): Promise<any> {
        return this.taskService.delete(id);
    }

    /**
     * 切换任务状态
     * @param body 
     * @returns 
     */
    @Post('/status')
    @UseGuards(AuthGuard('jwt'))
    public async status(@Body() body: any): Promise<any> {
        return this.taskService.changeStatus(body);
    }

    /**
     * 查询任务详情
     * @param id 
     * @returns 
     */
    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('id') id: number): Promise<any> {
        return this.taskService.detail(id);
    }
}
