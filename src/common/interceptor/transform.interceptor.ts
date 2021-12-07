import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
    data: any,
    message: string,
    code: number
}

/**
 * 定义一个拦截器，当正确返回数据的时候 对返回的数据进行格式化包装，返回给前端
 * 全局注册让它对所有接口生效
 */

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
        return next.handle().pipe(
            map(data => {
                console.log(data);
                return {
                    data,
                    message: '操作成功',
                    code: 10000,
                    ...data
                };
            }),
        );
    }
}
