import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../config/log.config';

/**
 * http异常过滤器，捕获http异常 HttpException
 * 当某一个请求发生错误时，拦截请求，返回前端标准格式的返回信息
 * 当一个请求成功是，返回前端标准格式的信息使用拦截器处理的
 * 全局使用
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // 获取异常状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 获取错误信息
    const exceptionResponse = exception.getResponse();
    console.log(exceptionResponse);
    let message;
    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message;
      }
    } else {
      message = status >= 500 ? 'Service Error' : 'Client Error';
    }
    Logger.log('错误提示', message);
    const errorResponse = {
      data: {},
      message,
      code: 9999, // 自定义code
    };
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
