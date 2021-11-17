import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

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
}
