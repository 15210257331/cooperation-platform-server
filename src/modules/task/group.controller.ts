/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, Body, Request, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskAddDTO } from './dto/task-add.dto';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';

@ApiTags('分组相关接口')
@Controller('group')
export class GroupController {
    constructor(
        private readonly groupService: GroupService
    ) { }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    public async taskAdd(@Body() groupAddDTO: any, @Request() request: any): Promise<any> {
        return this.groupService.add(groupAddDTO, request);
    }

    @Get('/list')
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('name') groupName: string): Promise<any> {
        return this.groupService.list(groupName);
    }

    /**
     * 分组详情
     * @param groupName 
     * @returns 
     */
    @Get('/detail')
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('groupId', new ParseIntPipe()) groupId: number): Promise<any> {
        return this.groupService.detail(groupId);
    }

}
