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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  //所有项目列表
  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(@Request() request: any): Promise<any> {
    return this.projectService.list(request);
  }

  /** 创建项目 */
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() request: any,
  ): Promise<any> {
    return this.projectService.create(createProjectDto, request);
  }

  /** 项目信息修改 */
  @Post('/update')
  @UseGuards(AuthGuard('jwt'))
  public async update(
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<any> {
    return this.projectService.update(updateProjectDto);
  }

  // 删除项目
  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<any> {
    return this.projectService.delete(id);
  }
}
