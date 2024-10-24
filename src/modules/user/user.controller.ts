import {
  Controller,
  Get,
  Body,
  UseGuards,
  Post,
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
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from './entity/user.entity';
import { GitHubService } from './github.service';
import { WechatService } from './wechat.service';

@ApiTags('用户相关')
@Controller('/user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly gitHubService: GitHubService,
    private readonly wechatService: WechatService,
    private configService: ConfigService,
  ) {}

  // 登录
  @Post('/login')
  // @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(@Body() loginDTO: LoginDTO): Promise<any> {
    return this.userService.login(loginDTO);
  }
  /**
   * 获取用户信息
   * @param request
   * @returns
   */
  @Get('/info')
  // 自定义装饰器，给路由处理器设置元数据，RoleGuard中可以拿到进行处理
  // 拥有角色名称为管理员 和超级管理员的用户有访问该接口的权限
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  // guard的顺序不能乱
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  // 使用此拦截器结合entity中的Exclude装饰器可以查询数据时隐藏相应的字段
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUserInfo(@Request() request: any): Promise<any> {
    return this.userService.getUserInfo(request);
  }

  /**
   * 微信登录，跳转微信扫码页面
   * @param header
   * @param res
   */
  @Get('/wechat/authorize')
  public async wechatAuthorize(@Headers() header, @Res() res): Promise<any> {
    return this.wechatService.wechatAuthorize();
  }
  /**
   * 获取微信用户信息
   * 微信登录 获取微信的accessToken, 使用accessToken请求用户信息
   * @param code
   * @returns
   */
  @Post('/wechat/login')
  async wechatLogin(@Body('code') code: string) {
    return this.wechatService.wechatLogin(code);
  }

  /**
   * github登录，跳转到github授权页面
   * @param header
   * @param res
   */
  @Get('/github/authorize')
  public async githubAuthorize(): Promise<any> {
    return this.gitHubService.githubAuthorize();
  }

  /**
   * github登录，获取accessToken
   * github授权成功重定向到本应用界面并返回code，通过code请求accessToken
   * 通过accessToken 请求用户信息
   * @param header
   * @param res
   */
  @Post('/github/login')
  public async githubLogin(@Body('code') code: string): Promise<any> {
    return this.gitHubService.githubLogin(code);
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

  // 分页查询用户列表
  @Post('/list')
  @UseGuards(AuthGuard('jwt'))
  public async list(@Body() body: any): Promise<any> {
    return this.userService.userList(body);
  }

  // 分页查询角色列表
  @Post('/role/list')
  @UseGuards(AuthGuard('jwt'))
  public async roleList(@Body() body: any): Promise<any> {
    return this.userService.roleList(body);
  }

  // 添加角色
  @Post('/role/add')
  @UseGuards(AuthGuard('jwt'))
  public async roleAdd(@Body() body: any): Promise<any> {
    return this.userService.roleAdd(body);
  }

  // 删除角色
  @Get('/role/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  public async roleDelete(@Param('id') id: string): Promise<any> {
    return this.userService.roleDelete(id);
  }

  // 修改角色
  @Post('/role/update')
  @UseGuards(AuthGuard('jwt'))
  public async roleUpdate(@Body() body: any): Promise<any> {
    return this.userService.roleUpdate(body);
  }

  // 为指定用户设置角色
  @Post('/setRole')
  @UseGuards(AuthGuard('jwt'))
  public async setRole(@Body() data: any): Promise<any> {
    return this.userService.setRole(data);
  }

  // 设置角色权限
  @Post('/role/setPermission')
  @UseGuards(AuthGuard('jwt'))
  public async roleSetPermission(@Body() body: any): Promise<any> {
    return this.userService.roleSetPermission(body);
  }

  /** 用户数据排行 */
  @Get('/rank')
  @UseGuards(AuthGuard('jwt'))
  public async userRank(
    @Query('type', new ParseIntPipe()) type: number,
  ): Promise<any> {
    return this.userService.rank(type);
  }
}
