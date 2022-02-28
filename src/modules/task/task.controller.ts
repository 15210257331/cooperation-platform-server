/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe, Param } from '@nestjs/common';
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

    //所有任务list
    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query() keywords: string, @Request() request: any): Promise<any> {
        return this.taskService.list(keywords, request);
    }

    //新增任务
    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async taskAdd(@Body() taskAddDTO: TaskAddDTO, @Request() request: any): Promise<any> {
        return this.taskService.taskAdd(taskAddDTO, request);
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
    public async delete(@Param('id', new ParseIntPipe()) id: number, @TransactionManager() maneger: EntityManager): Promise<any> {
        return this.taskService.delete(id, maneger);
    }

    // 添加子任务
    @Post('/addChildTask')
    @UseGuards(AuthGuard('jwt'))
    public async addChildTask(@Body() body: any): Promise<any> {
        return this.taskService.addChildTask(body);
    }

    // 删除子任务
    @Get('/deleteChildTask/:id')
    @UseGuards(AuthGuard('jwt'))
    public async deleteChildTask(@Param('id', new ParseIntPipe()) id: number): Promise<any> {
        return this.taskService.deleteChildTask(id);
    }

    // 完成子任务
    @Post('/completeSub')
    @UseGuards(AuthGuard('jwt'))
    public async completeSub(@Body() body: any): Promise<any> {
        return this.taskService.completeSub(body);
    }

    // 添加图片附件
    @Post('/addPicture')
    @UseGuards(AuthGuard('jwt'))
    public async addPicture(@Body() body: any): Promise<any> {
        return this.taskService.addPicture(body);
    }

    // 删除图片
    @Get('/deletePicture/:id')
    @UseGuards(AuthGuard('jwt'))
    public async deletePicture(@Param('id', new ParseIntPipe()) id: number): Promise<any> {
        console.log(123);
        return this.taskService.deletePicture(id);
    }

    // 关联笔记
    @Post('/linkNote')
    @UseGuards(AuthGuard('jwt'))
    public async linkNote(@Body() body: any): Promise<any> {
        return this.taskService.linkNote(body);
    }

    // 删除笔记
    @Get('/deleteNote/:id')
    @UseGuards(AuthGuard('jwt'))
    public async deleteNote(@Param('id', new ParseIntPipe()) id: number): Promise<any> {
        console.log(123);
        return this.taskService.deleteNote(id);
    }
}
