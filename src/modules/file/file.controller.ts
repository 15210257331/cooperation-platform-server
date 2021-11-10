/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
}
