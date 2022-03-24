import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { RoleAddDTO } from './dto/role-add.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { RoleAuthorityDTO } from './dto/role-authority';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('角色相关接口')
@Controller('/role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
    ) { }

    // 添加角色
    @Post('/add')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleAdd(@Body() roleAddDTO: RoleAddDTO,): Promise<any> {
        return this.roleService.roleAdd(roleAddDTO);
    }

    /**
     * @param data 
     * 分页查询角色列表
     */
    @Post('/list')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleList(@Body() data: any,): Promise<any> {
        return this.roleService.roleList(data);
    }

    /**
     * @param data 
     * 所有角色不分页
     */
    @Get('/all')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async allRole(): Promise<any> {
        return this.roleService.roleAll();
    }

    // 角色删除
    @Get('/delete/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleDelete(@Param('id') id: number | string): Promise<any> {
        return this.roleService.roleDelete(id);
    }


    // 角色详情
    @Get('/roleInfo')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleInfo(@Query('id', new ParseIntPipe()) id: number): Promise<any> {
        return this.roleService.roleInfo(id);
    }

    // 角色修改
    @Post('/update')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleUpdate(@Body() roleUpdateDTO: RoleUpdateDTO,): Promise<any> {
        return this.roleService.roleUpdate(roleUpdateDTO);
    }

}
