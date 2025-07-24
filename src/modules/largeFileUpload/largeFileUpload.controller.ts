import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LargeFileUploadService } from './largeFileUpload.service';
import { Request } from 'express';
import { File } from 'multer';

// 大文件分片上传
@Controller('largeFileUpload')
export class LargeFileUploadController {
  constructor(
    private readonly largeFileUploadService: LargeFileUploadService,
  ) {}

  // 检查是否已上传/分片状态
  @Post('verify')
  async verifyFile(@Body() body: any) {
    return await this.largeFileUploadService.verifyFile(body);
  }

  // 上传单个分片
  @Post('upload')
  @UseInterceptors(FileInterceptor('chunk'))
  async uploadChunk(@UploadedFile() file: File, @Req() req: Request) {
    return await this.largeFileUploadService.uploadChunk(file, req.body);
  }

  // 合并切片
  @Post('merge')
  async mergeChunks(@Body() body: any) {
    return await this.largeFileUploadService.mergeChunks(body);
  }
}
