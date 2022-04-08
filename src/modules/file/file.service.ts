import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { tar } from 'compressing';
import { CosService } from './cos.service';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private cosService: CosService,
  ) {}

  /**
   * 上传文件到腾讯云COS
   * @param file
   * @param body
   */
  async uploadFile(file: any, body: any): Promise<any> {
    // console.log(file);
    return await this.cosService.uploadFile(file.filename, file.path);
  }

  /**
   * 获取腾讯云COS文件
   * @param filename  文件名
   */
  async getFile(filename: string): Promise<any> {
    return await this.cosService.getFile(filename);
  }

  // 文件打包下载
  async downloadAll() {
    const uploadDir = this.configService.get('file').root;
    const tarStream = new tar.Stream();
    await tarStream.addEntry(uploadDir);
    return { filename: 'hello-world.tar', tarStream };
  }
}
