import { Module } from '@nestjs/common';
import { FileDownloadController } from './fileDownload.controller';
import { FileDownloadService } from './fileDownload.service';
@Module({
  imports: [],
  controllers: [FileDownloadController],
  providers: [FileDownloadService],
})
export class FileDownloadModule {}
