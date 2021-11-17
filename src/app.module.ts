import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { TaskModule } from './modules/task/task.module';
import { EventsGateway } from './utils/events.gateway';
import { RoleModule } from './modules/role/role.module';
import { ConfigModule } from './config/config.module';
import { User } from './modules/role/user.entity';
import { Role } from './modules/role/role.entity';
import { Task } from './modules/task/task.entity';
import { Group } from './modules/task/group.entity';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const { host, dbPort, username, password, database } = configService;
    //     return {
    //       type: 'mysql',
    //       host,
    //       port: dbPort,
    //       username,
    //       password,
    //       database,
    //       entities: ['dist/**/*.entity{.ts,.js}'],
    //       charset: "utf8mb4",
    //       synchronize: true,
    //     };
    //   },
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '129.211.164.125',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nice-todo',
      entities: [User, Role, Task, Group],
      // entities: ['dist/**/*.entity{.ts,.js}']，
      // 设置chatset编码为utf8mb4
      charset: "utf8mb4",
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FileModule,
    TaskModule,
    RoleModule,
    ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule { }
