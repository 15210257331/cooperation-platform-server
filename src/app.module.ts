import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { TaskModule } from './modules/task/task.module';
import { EventsGateway } from './utils/events.gateway';
import { RoleModule } from './modules/role/role.module';

import configuration from './config/environment.config';
import * as Joi from '@hapi/joi';
import { RequestModule } from './modules/request/request.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      // 其他不用导入configModule 就能使用该模块
      isGlobal: true,
      // 根据启动脚本获取环境变量 从而加载不同环境的配置文件
      envFilePath: [process.env.NODE_ENV === 'dev' ? 'dev.env' : 'prod.env'],
      // 加载自定义配置文件
      load: [configuration],
      // 验证环境配置文件中的键值对规则
      validationSchema: Joi.object({
        HOST: Joi.string(),
        PORT: Joi.number().default(4000),
        DB_NAME: Joi.string(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().default('root'),
        DB_PASSWORD: Joi.string().default(123456),
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
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { database, host, port, username, password } = configService.get('db');
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: ['dist/**/*.entity{.ts,.js}'],
          charset: "utf8mb4",
          synchronize: true,
        };
      },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    FileModule,
    TaskModule,
    RoleModule,
    RequestModule,
    // CronModule
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule { }
