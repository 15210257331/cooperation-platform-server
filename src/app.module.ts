import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { TaskModule } from './modules/task/task.module';
import { EventsGateway } from './utils/events.gateway';
import { RoleModule } from './modules/role/role.module';
import { Role } from './entity/role.entity';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '129.211.164.125',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'simple_pm',
      entities: [User, Role],
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
