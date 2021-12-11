/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

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
     */
    @Post('/delete')
    @UseGuards(AuthGuard('jwt'))
    @Transaction()
    public async delete(@Body() body: any, @TransactionManager() maneger: EntityManager): Promise<any> {
        return this.taskService.delete(body, maneger);
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

    // 更新任务
    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    public async update(@Body() body: any): Promise<any> {
        return this.taskService.update(body);
    }

    /**
     * 查询任务详情
     * @param id 
     * @returns 
     */
    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('taskId') taskId: number): Promise<any> {
        return this.taskService.detail(taskId);
    }

    // 完成子任务
    @Post('/completeSub')
    @UseGuards(AuthGuard('jwt'))
    public async completeSub(@Body() body: any): Promise<any> {
        return this.taskService.completeSub(body);
    }

    /**
     * 任务消息
     * @param id 
     * @returns 
     */
    @Get('/message')
    @UseGuards(AuthGuard('jwt'))
    public async message(): Promise<any> {
        return this.taskService.message();
    }

    /**
     * 任务数量排行榜
     * @param id 
     * @returns 
     */
    @Get('/rank')
    @UseGuards(AuthGuard('jwt'))
    public async rank(): Promise<any> {
        return this.taskService.rank();
    }

    /**
     * 任务数量排行榜
     * @param id 
     * @returns 
     */
     @Get('/trend')
     @UseGuards(AuthGuard('jwt'))
     public async trend(): Promise<any> {
         return this.taskService.trend();
     }
}
