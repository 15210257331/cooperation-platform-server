import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../role/entity/role.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { Statistics } from '../statistics/entity/statistics.entity';
import { SmsService } from './sms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([User,Role]),
        AuthModule, // AuthModule 导出了 JwtModule JwtService依赖于JwtModule 否则userModule 无法使用JwtService
        StatisticsModule,
        HttpModule
    ],
    providers: [UserService,SmsService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
