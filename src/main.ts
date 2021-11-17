import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './common/middleware/loger.middleware';
import { LogerInterceptor } from './common/interceptor/loger.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 处理跨域问题
  app.enableCors();

  // 监听所有的请求路由，使用中间件打印入参
  // app.use(express.json()); // For parsing application/json
  // app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // app.use(logger);
  

  // 设置api前缀
  app.setGlobalPrefix('api');

  // 设置静态目录 /public/ 在地址栏输入xxxx:5000/public/ 时会找到upload目录
  app.useStaticAssets(path.resolve(__dirname, './public'), { "prefix": "/public/" });

  // 全局注册拦截器 格式化接口成功返回数据
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局注册拦截器 打印日志
  app.useGlobalInterceptors(new LogerInterceptor());

  // 全局注册错误的过滤器  格式化接口异常返回数据
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 Swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nice todo api')
    .setDescription('Nice todo 的api文档')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(4000);
}
bootstrap();
