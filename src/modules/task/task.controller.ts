/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { Result } from '../../interface/result.interface';

@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService
    ) { }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async taskAdd(@Body() taskAddDTO: TaskAddDTO, @Request() request: any): Promise<Result> {
        return this.taskService.taskAdd(taskAddDTO, request);
    }

    @Get('/delete')
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Query('id') id: number): Promise<Result> {
        return this.taskService.delete(id);
    }

    @Post('/deleteList')
    @UseGuards(AuthGuard('jwt'))
    public async deleteList(@Body() body: any): Promise<Result> {
        return this.taskService.deleteList(body);
    }

    @Post('/status')
    @UseGuards(AuthGuard('jwt'))
    public async status(@Body() body: any): Promise<Result> {
        return this.taskService.changeStatus(body);
    }

    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('id') id: number): Promise<Result> {
        return this.taskService.detail(id);
    }

    @Get('/comment')
    @UseGuards(AuthGuard('jwt'))
    public async comment(@Query('id') id: number): Promise<Result> {
        return this.taskService.comment(id);
    }

    @Post('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Body() body: any): Promise<Result> {
        return this.taskService.list(body);
    }
}
