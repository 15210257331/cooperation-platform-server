import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import { CosService } from './cos.service';
const imageMimeTypes = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
const videosMimeTypes = ['mp4', 'webm'];
const audiosMimeTypes = ['mp3', 'wav', 'ogg'];
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后在服务器的存储位置
        // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
        destination: (req, file, cb) => {
          const mimeType = file.mimetype.split('/')[1];
          let suffix = 'other';
          if (imageMimeTypes.some((item) => item === mimeType)) {
            suffix = 'image';
          }
          if (videosMimeTypes.some((item) => item === mimeType)) {
            suffix = 'video';
          }
          if (audiosMimeTypes.some((item) => item === mimeType)) {
            suffix = 'audio';
          }
          const filePath = path.resolve(__dirname, '../../public');
          
          try {
            fs.accessSync(filePath);
          } catch (e) {
            console.log(filePath);
            fs.mkdirSync(filePath);
          }
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          // 自定义文件名 给文件名打上时间戳
          const index = file.originalname.lastIndexOf('.');
          const filename =
            file.originalname.substring(0, index) +
            '-' +
            dayjs().unix() +
            file.originalname.substring(index);
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService, CosService],
})
export class FileModule {}
