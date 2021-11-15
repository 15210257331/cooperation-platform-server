import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { RoleAddDTO } from './dto/role-add.dto';
import { Result } from '../../common/interface/result.interface';
import { AuthGuard } from '@nestjs/passport';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { RoleAuthorityDTO } from './dto/role-authority';

@Controller('/role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
    ) { }

    // 添加角色
    @Post('/add')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async roleAdd(@Body() roleAddDTO: RoleAddDTO,): Promise<Result> {
        return this.roleService.roleAdd(roleAddDTO);
    }

     /**
      * @param data 
      * 分页查询角色列表
      */
     @Post('/list')
     @UsePipes(new ValidationPipe())
     @UseGuards(AuthGuard('jwt'))
     public async roleList(@Body() data: any,): Promise<Result> {
         return this.roleService.roleList(data);
     }

     /**
      * @param data 
      * 所有角色不分页
      */
     @Get('/all')
     @UsePipes(new ValidationPipe())
     @UseGuards(AuthGuard('jwt'))
     public async allRole(): Promise<Result> {
         return this.roleService.allRole();
     }

     // 角色删除
     @Get('/delete/:id')
     @UsePipes(new ValidationPipe())
     @UseGuards(AuthGuard('jwt'))
     public async roleDelete(@Param('id') id: number | string): Promise<Result> {
         return this.roleService.roleDelete(id);
     }

     // 角色更新
     @Post('/update')
     @UsePipes(new ValidationPipe())
     @UseGuards(AuthGuard('jwt'))
     public async roleUpdate(@Body() roleUpdateDTO: RoleUpdateDTO,): Promise<Result> {
         return this.roleService.roleUpdate(roleUpdateDTO);
     }

     // 角色关联权限
     @Post('/relevanceAuthority')
     @UsePipes(new ValidationPipe())
     @UseGuards(AuthGuard('jwt'))
     public async relevanceAuthority(@Body() roleAuthorityDTO: RoleAuthorityDTO,): Promise<Result> {
         return this.roleService.relevanceAuthority(roleAuthorityDTO);
     }

}
