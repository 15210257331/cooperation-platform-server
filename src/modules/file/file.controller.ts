/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from './file.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('文件相关')
@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async UploadedFile(@UploadedFile() file, @Body() body) {
        return this.fileService.uploadedFile(file, body);
    }

    @Get('/:filePath')
    render(@Param('filePath') filePath, @Res() res) {
        return this.fileService.getImg(filePath,res);
    }

    @Get('export')
    async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.fileService.downloadAll();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );
    tarStream.pipe(res);
  }
}
