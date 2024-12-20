/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Query,
  ParseIntPipe,
  UsePipes,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { FlowService } from './flow.service';

@ApiTags('流程节点相关接口')
@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  /** 新增节点 */
  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  public async add(
    @Body() createFlowDto: CreateFlowDto,
    @Request() request: any,
  ): Promise<any> {
    return this.flowService.create(createFlowDto, request);
  }

  @Post('/update')
  @UseGuards(AuthGuard('jwt'))
  public async update(@Body() updateFlowDto: UpdateFlowDto): Promise<any> {
    return this.flowService.update(updateFlowDto);
  }

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(
    @Query('projectId') projectId: string,
    @Query('name') name: string,
  ): Promise<any> {
    return this.flowService.list(projectId, name);
  }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  public async all(@Request() request: any): Promise<any> {
    return this.flowService.all(request);
  }

  // 删除节点
  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  public async delete(
    @Param('id') id: string,
  ): Promise<any> {
    return this.flowService.delete(id);
  }
}
