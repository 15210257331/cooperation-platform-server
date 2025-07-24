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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileDownloadService } from './fileDownload.service';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('文件下载')
@Controller('fileDownload')
export class FileDownloadController {
  constructor(private readonly fileDownloadService: FileDownloadService) {}

  // 通过a链接进行文件下载
  // 使用 @Res() 是因为我们要控制 response，而不是返回 Nest 的标准格式
  @Get('a-download')
  public async aDownloadFile(@Res() res: Response) {
    return this.fileDownloadService.aDownloadFile(res);
  }

  // 将多个文件打包成压缩包进行下载
  @Get('download-zip')
  async downloadZip(@Res() res: Response) {
    return this.fileDownloadService.downloadZip(res);
  }

  // 流式文件下载
  @Get('stream-download')
  streamDownload(@Res() res: Response) {
    return this.fileDownloadService.streamDownload(res);
  }

  // 分片下载获取文件大小
  @Get('file-size/:fileName')
  getFileSize(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.fileDownloadService.getFileSize(fileName, res);
  }

  // 分片下载
  @Get('download/:fileName')
  downloadFile(
    @Param('fileName') fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.fileDownloadService.downloadFile(fileName, req, res);
  }
}
