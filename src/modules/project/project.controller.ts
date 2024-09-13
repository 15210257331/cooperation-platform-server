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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('项目接口')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  //所有项目列表
  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(
    @Request() request: any,
    @Query('sort') sort: string,
  ): Promise<any> {
    return this.projectService.list(request, sort);
  }

  // 项目详情
  @Get('/detail/:id')
  @UseGuards(AuthGuard('jwt'))
  public async detail(@Param('id') id: string): Promise<any> {
    return this.projectService.detail(id);
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

  /** 添加项目成员 */
  @Post('/addMember')
  @UseGuards(AuthGuard('jwt'))
  public async addMember(@Body() body: { projectId: string, memberId: string }): Promise<any> {
    return this.projectService.addMember(body);
  }

  /** 项目星标切换 */
  @Post('/star')
  @UseGuards(AuthGuard('jwt'))
  public async star(@Body() body: { id: string; star: boolean }): Promise<any> {
    const { id, star } = body;
    return this.projectService.star(id, star);
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
