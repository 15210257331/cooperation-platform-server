import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../config/log.config';

/**
 * 日志拦截器 用来打印返回数据
 */
@Injectable()
export class LogerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map(data => {
        const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
              Request original url: ${req.originalUrl}
              Method: ${req.method}
              IP: ${req.ip}
              User: ${JSON.stringify(req.user)}
              Response data:\n ${JSON.stringify(data.data)}
             <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return data;
      }),
    );
  }
}
