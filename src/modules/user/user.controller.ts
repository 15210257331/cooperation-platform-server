import {
  Controller,
  Get,
  Body,
  UseGuards,
  Post,
  UsePipes,
  Delete,
  Param,
  Request,
  Query,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  Res,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as urlencode from 'urlencode';
import { ConfigService } from '@nestjs/config';
import { UpdateDTO } from './dto/update.dto';

@ApiTags('用户相关')
@Controller('/user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  // 登录
  @Post('/login')
  // @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(@Body() loginDTO: LoginDTO): Promise<any> {
    return this.userService.login(loginDTO);
  }

  // 跳转微信扫码页面
  @Get('/wechatLogin')
  public async wechatLogin(@Headers() header, @Res() res): Promise<any> {
    const APPID = this.configService.get('secretId');
    const host = this.configService.get('HOST');
    const redirectUri = urlencode(host);
    res.redirect(
      `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
    );
  }

  // 微信登录
  @Post('wechat')
  async loginWithWechat(@Body('code') code: string) {
    return this.userService.loginWithWechat(code);
  }

  // 注册
  @Post('/register')
  public async register(@Body() data: RegisterDTO): Promise<any> {
    return this.userService.register(data);
  }

  // 向手机发送验证码
  @Post('/code')
  public async code(@Body() data: any): Promise<any> {
    return this.userService.sendVerificationCode(data);
  }

  // 获取用户信息
  @Get('/info')
  @UseGuards(AuthGuard('jwt'))
  // 使用此拦截器结合entity中的Exclude装饰器可以查询数据时隐藏相应的字段
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUserInfo(@Request() request: any): Promise<any> {
    return this.userService.getUserInfo(request);
  }

  // 用户删除
  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  public async deleteUser(@Param('id') id: number | string): Promise<any> {
    return this.userService.deleteUser(id);
  }

  // 更新用户信息
  @Post('/update')
  @UseGuards(AuthGuard('jwt'))
  public async updateUserInfo(
    @Body() data: UpdateDTO,
    @Request() request: any,
  ): Promise<any> {
    return this.userService.updateUserInfo(data, request);
  }

  // 更新指定用户角色
  @Post('/setRole')
  @UseGuards(AuthGuard('jwt'))
  public async setRole(@Body() data: any): Promise<any> {
    return this.userService.setRole(data);
  }

  // 分页查询用户列表
  @Post('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(@Body() body: any): Promise<any> {
    return this.userService.userList(body);
  }
}
