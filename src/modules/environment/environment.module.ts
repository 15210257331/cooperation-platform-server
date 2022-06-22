import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import configuration from './environment.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      // 使其他模块不用导入configModule就能使用该模块
      isGlobal: true,
      // 根据启动脚本获取环境变量 从而加载不同环境的配置文件
      envFilePath: [process.env.NODE_ENV === 'dev' ? 'dev.env' : 'prod.env'],
      // 加载自定义配置文件
      load: [configuration],
      // 验证环境配置文件中的键值对规则
      validationSchema: Joi.object({
        db_host: Joi.string(),
        db_name: Joi.string(),
        db_port: Joi.number().default(3306),
        db_username: Joi.string().default('root'),
        db_password: Joi.string().default(123456),
      }),
      /**
       * allowUnknown:控制是否允许环境变量中未知的键。默认为true。
         abortEarly:如果为true，在遇到第一个错误时就停止验证；如果为false，返回所有错误。默认为false
       */
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class EnvironmentModule {}
