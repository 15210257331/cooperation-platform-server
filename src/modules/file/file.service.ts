import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class FileService {

    constructor(private config: ConfigService) {

    }

    // 文件上传
    async uploadedFile(file: any, body: any): Promise<any> {
        try {
            return {
                code: 10000,
                data: {
                    name: file.filename,
                    path: `http://${this.config.host}:${this.config.port}/public/${file.filename}`
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
        const path = `http://${this.config.host}:${this.config.port}/public/${filePath}`
        res.sendFile(path);
    }
}
