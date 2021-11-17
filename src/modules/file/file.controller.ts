/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from './file.service';

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
}
