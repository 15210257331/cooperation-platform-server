/*
 * @Author: your name
 * @Date: 2021-11-19 09:40:46
 * @LastEditTime: 2021-11-19 10:32:04
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /nice-todo-nest/src/modules/file/file.service.ts
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { tar } from 'compressing';

@Injectable()
export class FileService {

    constructor(private configService: ConfigService) {

    }

    // 文件上传
    async uploadedFile(file: any, body: any): Promise<any> {
        try {
            const { host, port} = this.configService.get('db');
            return {
                code: 10000,
                data: {
                    name: file.filename,
                    path: `http://${host}:${port}/public/${file.filename}`
                },
                msg: '上传成功'
            }
        } catch (err) {
            return {
                code: 999,
                data: null,
                msg: '上传失败'
            }
        }

    }

    // 图片查看
    async getImg(filePath: string, res: any) {
        const { host, port} = this.configService.get('db');
        const path = `http://${host}:${port}/public/${filePath}`
        res.sendFile(path);
    }

    // 文件打包下载
    async downloadAll() {
        const uploadDir = this.configService.get('file').root;
        const tarStream = new tar.Stream();
        await tarStream.addEntry(uploadDir);
        return { filename: 'hello-world.tar', tarStream };
      }
}
