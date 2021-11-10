import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../config/log.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): void {
        const code = res.statusCode;
        next();
        const logFormat = `Method: ${req.method} \n Request original url: ${req.originalUrl} \n IP: ${req.ip} \n Status code: ${code} \n`;
        if (code >= 500) {
            Logger.error(logFormat);
        } else if (code >= 400) {
            Logger.warn(logFormat);
        } else {
            Logger.access(logFormat);
            Logger.log(logFormat);
        }
    }
}

// 另一种方式函数式中间件
export function logger(req: Request, res: Response, next: () => any): void {
    const code = res.statusCode;
    next();
    // console.log(req);
    // req.parmas
    const logFormat = ` >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${code}
    Parmas: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `;
    if (code >= 500) {
        Logger.error(logFormat);
    } else if (code >= 400) {
        Logger.warn(logFormat);
    } else {
        Logger.access(logFormat);
        Logger.log(logFormat);
    }
}
