import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as dayjs from 'dayjs';
import * as fs from 'fs';

/**
 * 文件上传单独模块
 */

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // 设置图片的存储文件夹 如果不存在则创建
        destination: (req, file, cb) => {
          const dirPath = path.resolve(__dirname,'../../public');
          try {
            fs.accessSync(dirPath);
          } catch (e) {
            fs.mkdirSync(dirPath);
          }
          cb(null, dirPath);
        },
        filename: (req, file, cb) => {
          // 自定义文件名
          const filename = `${dayjs().unix()}.${file.mimetype.split('/')[1]}`;
          return cb(null, filename);
        },
      }),
    }),

  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule { }
