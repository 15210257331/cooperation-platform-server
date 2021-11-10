import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

/**
 * ConfigModule 注册一个 ConfigService ，并将其导出为在其他消费模块中可见。
 * 此外，我们使用 useValue 语法(参见自定义提供程序)来传递到 .env 文件的路径。此路径将根据 NODE_ENV 环境变量中包含的实际执行环境而不同(例如，’开发’、’生产’等)。
 * 现在您可以简单地在任何地方注入 ConfigService ，并根据传递的密钥检索特定的配置值。
 */

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
