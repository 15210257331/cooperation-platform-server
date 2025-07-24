import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { LargeFileUploadController } from './largeFileUpload.controller';
import { LargeFileUploadService } from './largeFileUpload.service';
// 大文件分片上传 断点续传 秒传

@Module({
  imports: [
    // 配置文件上传的路径 如果不配置则文件默认放在内存中供后续处理
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const filePath = path.resolve(__dirname, '../../public');
          try {
            fs.accessSync(filePath);
          } catch (e) {
            fs.mkdirSync(filePath);
          }
          cb(null, filePath);
        },
      }),
    }),
  ],
  controllers: [LargeFileUploadController],
  providers: [LargeFileUploadService],
})
export class LargeFileUploadModule {}
