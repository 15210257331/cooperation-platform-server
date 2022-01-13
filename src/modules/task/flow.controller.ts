/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { GroupAddDTO } from './dto/group-add.dto';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { GroupUpdateDTO } from './dto/group-update.dto';
import { FlowAddDTO } from './dto/flow-add.dto';
import { FlowUpdateDTO } from './dto/flow-update.dto';
import { FlowService } from './flow.service';

@ApiTags('六层节点相关接口')
@Controller('flow')
export class FlowController {
    constructor(
        private readonly flowService: FlowService
    ) { }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async add(@Body() flowAddDTO: FlowAddDTO, @Request() request: any): Promise<any> {
        return this.flowService.add(flowAddDTO, request);
    }

    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    public async update(@Body() flowUpdateDTO: FlowUpdateDTO): Promise<any> {
        return this.flowService.update(flowUpdateDTO);
    }

    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('keywords') keywords: string, @Request() request: any): Promise<any> {
        return this.flowService.list(keywords,request);
    }

    // 删除分组
    @Get('/delete/:id')
    @UseGuards(AuthGuard('jwt'))
    @Transaction()
    public async delete(@Param('id', new ParseIntPipe()) id: number, @TransactionManager() maneger: EntityManager,): Promise<any> {
        return this.flowService.delete(id, maneger);
    }

}
