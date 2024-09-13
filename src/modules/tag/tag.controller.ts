import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagAddDTO } from './dto/tag-add.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(@Query('projectId') projectId: string): Promise<any> {
    return this.tagService.list(projectId);
  }

  //   添加标签
  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Body() tagAddDTO: TagAddDTO,
    @Request() request: any,
  ): Promise<any> {
    return this.tagService.create(tagAddDTO, request);
  }
}
