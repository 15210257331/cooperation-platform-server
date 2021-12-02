import { Body, Controller, Get, Param, Post, Query,Request, UseGuards, UsePipes } from '@nestjs/common';
import { NoteService } from './note.service';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { NoteAddDTO } from './dto/note-add.dto';

@ApiTags('笔记相关接口')
@Controller('/note')
export class NoteController {
    constructor(
        private readonly roleService: NoteService,
    ) { }

    // 添加笔记
    @Post('/add')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async add(@Body() roleAddDTO: NoteAddDTO, @Request() request: any): Promise<any> {
        return this.roleService.add(roleAddDTO, request);
    }

    // 查询笔记不分页
    @Get('/list')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('keywords') keywords?: string): Promise<any> {
        return this.roleService.list(keywords);
    }

    // 删除笔记
    @Get('/delete/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id: number | string): Promise<any> {
        return this.roleService.delete(id);
    }

}
