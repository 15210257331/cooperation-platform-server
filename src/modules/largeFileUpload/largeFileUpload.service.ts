import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fse from 'fs-extra';
import { File } from 'multer';

const UPLOAD_DIR = path.resolve(__dirname, '../../filelist');

@Injectable()
export class LargeFileUploadService {
  private getChunkDir(fileHash: string) {
    return path.resolve(UPLOAD_DIR, fileHash);
  }

  // 检查是否已上传/分片状态
  async verifyFile({ fileHash, suffix }) {
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}.${suffix}`);
    if (fse.existsSync(filePath)) {
      return { code: 200, shouldUpload: false };
    }
    const chunkDir = this.getChunkDir(fileHash);
    const exists = fse.existsSync(chunkDir);
    const uploadedChunkList = exists ? await fse.readdir(chunkDir) : [];
    return {
      shouldUpload: true,
      uploadedChunkList,
    };
  }

  // 文件分片上传
  async uploadChunk(file: File, body: any) {
    const { hash } = body;
    const fileHash = hash.split('-')[0];
    const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }
    await fse.move(file.path, chunkDir + '/' + hash);
    return { message: 'chunk received' };
  }

  // 合并分片
  async mergeChunks({ fileHash, suffix, size }) {
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}.${suffix}`);
    const chunkPaths = await fse.readdir(path.resolve(UPLOAD_DIR, fileHash));
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    await Promise.all(
      chunkPaths.map((chunkName, index) => {
        const chunkPath = path.resolve(
          path.resolve(UPLOAD_DIR, fileHash),
          chunkName,
        );
        return this.pipeStream(
          chunkPath,
          fse.createWriteStream(filePath, {
            start: index * size,
            end: (index + 1) * size,
          }),
        );
      }),
    );
    // 删除临时切片目录
    fse.rmdirSync(path.resolve(UPLOAD_DIR, fileHash));
    return { message: 'merge success' };
  }

  private pipeStream(chunkPath: string, writeStream: fse.WriteStream) {
    return new Promise<void>((resolve) => {
      const readStream = fse.createReadStream(chunkPath);
      readStream.pipe(writeStream);
      readStream.on('end', () => {
        fse.unlinkSync(chunkPath); // 删除分片
        resolve();
      });
    });
  }
}
