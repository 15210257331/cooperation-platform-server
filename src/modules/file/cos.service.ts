import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const COS = require('cos-nodejs-sdk-v5');
import * as fs from 'fs';
import { UploadFileRo } from '../../interface/file.interface';

@Injectable()
export class CosService {
  public cos;
  constructor(private configService: ConfigService) {
    this.cos = new COS({
      SecretId: this.configService.get('secretId'),
      SecretKey: this.configService.get('secretKey'),
    });
  }

  /**
   *
   * @param filename  显示在储存桶列表中的文件名称
   * @param localPath 文件路径
   * @returns 返回文件名和文件url地址
   */
  async uploadFile(filename: string, localPath: string): Promise<UploadFileRo> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'nice-todo-1256042788' /* 填入您自己的存储桶，必须字段 */,
        Region: 'ap-nanjing' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key: filename /* 存储在桶里的对象键（文件名称），必须字段 */,
        StorageClass: 'STANDARD',
        ACL: 'public-read', // 上传对象的访问权限
        /* 当Body为stream类型时，ContentLength必传，否则onProgress不能返回正确的进度信息 */
        Body: fs.createReadStream(localPath), // 上传文件对象
        ContentLength: fs.statSync(localPath).size,
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData));
        },
      };
      this.cos.putObject(params, (err, data) => {
        // 记得删除存在服务器上的文件
        fs.unlinkSync(localPath);
        if (err) throw new HttpException(err, 200);
        resolve({
          filename: filename,
          url: 'https://' + data.Location,
        });
      });
    });
  }

  async getFile(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'nice-todo-1256042788' /* 填入您自己的存储桶，必须字段 */,
        Region: 'ap-nanjing' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key: filename /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        Sign: true /* 获取带签名的对象URL */,
      };
      this.cos.getObjectUrl(params, (err, data) => {
        if (err) reject(err);
        let url = data.Url;
        url =
          url +
          (url.indexOf('?') > -1 ? '&' : '?') +
          'response-content-disposition=inline'; // 补充强制下载的参数
        resolve(url);
      });
    });
  }
}
