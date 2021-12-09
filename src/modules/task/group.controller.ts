/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { GroupAddDTO } from './dto/group-add.dto';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { GroupUpdateDTO } from './dto/group-update.dto';

@ApiTags('分组相关接口')
@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService
    ) { }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async add(@Body() groupAddDTO: GroupAddDTO, @Request() request: any): Promise<any> {
        return this.groupService.add(groupAddDTO, request);
    }

    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    public async update(@Body() groupUpdateDTO: GroupUpdateDTO): Promise<any> {
        return this.groupService.update(groupUpdateDTO);
    }

    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('name') groupName: string, @Request() request: any): Promise<any> {
        return this.groupService.list(groupName, request);
    }

    // 删除分组
    @Get('/delete/:id')
    @UseGuards(AuthGuard('jwt'))
    @Transaction()
    public async delete(@Param('id') id: number | string, @TransactionManager() maneger: EntityManager,): Promise<any> {
        return this.groupService.delete(id,maneger);
    }

    // 分组详情
    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('groupId', new ParseIntPipe()) groupId: number): Promise<any> {
        return this.groupService.detail(groupId);
    }

}
