/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from './file.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('文件相关')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 先执行FileInterceptor拦截器，对文件进行相关操作并上传到指定文件夹 然后在执行上传腾讯COS的操作
  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file, @Body() body) {
    return this.fileService.uploadFile(file, body);
  }

  @Get('get')
  @UseGuards(AuthGuard('jwt'))
  public async getFile(@Query('filename') filename: string) {
    return this.fileService.getFile(filename);
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'))
  public async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.fileService.downloadAll();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    tarStream.pipe(res);
  }
}
