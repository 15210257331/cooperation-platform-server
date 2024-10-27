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
import { IterationService } from './iteration.service';
import { CreateIterationDto } from './dto/create-iteration.dto';

@Controller('iteration')
export class IterationController {
  constructor(private readonly iterationService: IterationService) {}

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(
    @Query('projectId') projectId: string,
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<any> {
    return this.iterationService.list(projectId, name, status);
  }

  //   添加标签
  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  public async create(
    @Body() createIterationDto: CreateIterationDto,
    @Request() request: any,
  ): Promise<any> {
    return this.iterationService.create(createIterationDto, request);
  }
}
