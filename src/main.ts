import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './middleware/loger.middleware';
import { LogerInterceptor } from './interceptor/loger.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { join, resolve } from 'path';
import { ValidationPipe } from './pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 处理跨域问题
  app.enableCors();

  // 设置api前缀
  app.setGlobalPrefix('api');

  // 监听所有的请求路由，使用中间件打印入参
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(logger);

  // 设置静态目录 public
  // 还支持第二个参数prefix来设置虚拟目录
  // 在地址栏输入xxxx:4000/public/test.png时会找到public目录下的test.png
  app.useStaticAssets(resolve(__dirname, './public'), { prefix: '/public' });

  // 设置views目录存放模板文件
  app.setBaseViewsDir(resolve(__dirname, '../views'));

  // 设置hbs为模板引擎
  app.setViewEngine('hbs');

  // 全局拦截器 格式化接口成功返回数据
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局拦截器 打印日志
  app.useGlobalInterceptors(new LogerInterceptor());

  // 全局过滤器  格式化接口异常返回数据
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  // 配置 Swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nice todo api')
    .setDescription('Nice todo 的api文档')
    .setVersion('1.0')
    .addTag('这是一个测试版本')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(4000);
}
bootstrap();
