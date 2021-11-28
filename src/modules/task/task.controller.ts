/*
 * @Author: your name
 * @Date: 2021-11-17 17:23:24
 * @LastEditTime: 2021-11-24 11:18:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /nice-todo-nest/src/modules/task/task.controller.ts
 */
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

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async taskAdd(@Body() taskAddDTO: TaskAddDTO, @Request() request: any): Promise<any> {
        return this.taskService.taskAdd(taskAddDTO, request);
    }

    /**
     * 
     * @param id 
     * @returns 
     * 使用了内置的ParseIntPipe管道，可以将id 转换成number类型
     */
    @Get('/delete')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Query('id', new ParseIntPipe()) id: number): Promise<any> {
        return this.taskService.delete(id);
    }

    @Post('/status')
    @UseGuards(AuthGuard('jwt'))
    public async status(@Body() body: any): Promise<any> {
        return this.taskService.changeStatus(body);
    }

    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('id') id: number): Promise<any> {
        return this.taskService.detail(id);
    }

    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('groupId') groupId: number): Promise<any> {
        return this.taskService.list(groupId);
    }


    @Get('/groupList')
    @UseGuards(AuthGuard('jwt'))
    public async groupList(@Query('name') name: string): Promise<any> {
        return this.taskService.groupList(name);
    }
}
