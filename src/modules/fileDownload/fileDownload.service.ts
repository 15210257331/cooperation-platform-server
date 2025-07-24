import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, resolve } from 'path';
import { tar } from 'compressing';
import * as fse from 'fs-extra';
import { Response, Request } from 'express';
import * as archiver from 'archiver';

//  __dirname 是一个全局变量，表示当前模块文件所在目录的绝对路径（不是当前工作目录，也不是文件路径，而是目录路径）。

@Injectable()
export class FileDownloadService {
  constructor(private configService: ConfigService) {}

  /**
   *
   * @param res
   * @returns
   */
  async aDownloadFile(res: Response) {
    const fileName = 'progit.pdf';
    const filePath = resolve(__dirname, '../../public', fileName);
    // 可选：检查文件是否存在
    if (!fse.existsSync(filePath)) {
      res.status(404).send('文件未找到');
      return;
    }
    const downloadName = 'custom-name.pdf'; // 下载时显示的文件名
    res.download(filePath, downloadName, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).send('下载失败');
      }
    });
  }

  /**
   * 多个文件打包下载
   * @param res
   * @returns
   */
  async downloadZip(res: Response) {
    const filesDir = resolve(__dirname, '../../public');
    if (!fse.existsSync(filesDir)) {
      return res.status(404).send('No files to compress');
    }
    // 设置响应头
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=bundle.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 }, // 压缩等级
    });
    archive.on('error', (err) => {
      throw err;
    });
    // 将 zip 数据流写入 response
    archive.pipe(res);
    // 添加目录下所有文件（不含子目录）
    const files = fse.readdirSync(filesDir);
    for (const file of files) {
      const filePath = join(filesDir, file);
      const stat = fse.statSync(filePath);
      if (stat.isFile()) {
        archive.file(filePath, { name: file }); // 添加到压缩包中
      }
    }
    await archive.finalize(); // 完成压缩并发送
  }

  // 流式文件下载
  streamDownload(res: Response) {
    const fileName = 'progit.pdf';
    const filePath = resolve(__dirname, '../../public', fileName);
    if (!fse.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }
    const stat = fse.statSync(filePath);
    const fileSize = stat.size;

    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=progit.pdf');

    const fileStream = fse.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(500).send('Internal Server Error');
    });
  }

  // 分片下载 获取文件大小
  getFileSize(fileName: string, res: Response) {
    try {
      const filePath = resolve(__dirname, '../../public', fileName);
      if (!fse.existsSync(filePath)) {
        return res.status(404).json({ error: '文件不存在' });
      }
      const stats = fse.statSync(filePath);
      res.json({
        size: stats.size,
        name: fileName,
      });
    } catch (err) {
      console.error('获取文件信息失败:', err);
      res.status(500).json({ error: '服务器错误' });
    }
  }

  // 分片下载文件
  downloadFile(fileName: string, req: Request, res: Response) {
    try {
      const filePath = resolve(__dirname, '../../public', fileName);
      if (!fse.existsSync(filePath)) {
        return res.status(404).json({ error: '文件不存在' });
      }

      const stat = fse.statSync(filePath);
      const fileSize = stat.size;
      // 请求头中的请求范围 格式：Range    bytes=10485760-12582911
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
          return res.status(416).send('请求范围不符合要求');
        }
        // 大小 包括请求范围等 单位都是字节bytes
        const chunkSize = end - start + 1;
        // 读取请求范围的文件可读流
        const file = fse.createReadStream(filePath, { start, end });
        //  range 请求状态码应该是206
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'application/octet-stream',
        });

        file.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'application/octet-stream',
        });
        fse.createReadStream(filePath).pipe(res);
      }
    } catch (err) {
      console.error('文件下载失败:', err);
      res.status(500).json({ error: '服务器错误' });
    }
  }
}
