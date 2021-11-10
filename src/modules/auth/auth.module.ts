import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
@Module({
  imports: [
    // 配置默认的策略 这样不用在每个路由上面添加 @UseGuards(AuthGuard('jwt'))
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'simple-pm-nest', // 设置secret
      signOptions: { expiresIn: '360000s' }, // 设置token的属性，时间为3600*10就是十小时
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy], // 把AuthService，LocalStrategy注册成提供者
  exports: [JwtModule, AuthService, LocalStrategy, JwtStrategy,PassportModule], // 把这个服务抛出，给其他模块使用
})
export class AuthModule { }
