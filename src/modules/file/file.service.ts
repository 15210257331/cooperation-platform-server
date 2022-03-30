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
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        return {
            name: file.filename,
            url: `http://${host}:${port}/public/${file.filename}`
        }
    }

    // 图片查看
    async getImg(filePath: string, res: any) {
        const { host, port } = this.configService.get('db');
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
