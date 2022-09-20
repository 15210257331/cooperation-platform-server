import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, Like, Any } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword, createCode } from '../../utils';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UpdateDTO } from './dto/update.dto';
import {
  AccessTokenInfo,
  WechatError,
  WechatUserInfo,
  AccessConfig,
} from '../../interface/wechat.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private smsService: SmsService,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  // 手机号---验证码 map
  private verificationCodeMap: Map<string, string> = new Map<string, string>();
  // 微信accessToken信息
  private accessTokenInfo: AccessTokenInfo;
  public apiServer = 'https://api.weixin.qq.com';

  // 登录
  async login(loginDTO: LoginDTO): Promise<any> {
    const { username, password } = loginDTO;
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      // 加密后的密码
      const hashPwd = encryptPassword(password);
      console.log(hashPwd);
      if (user.password === hashPwd) {
        const payload = {
          username: username,
          userId: user.id,
        };
        // 生成token
        const token = this.jwtService.sign(payload);
        return {
          token: token,
          userInfo: user,
        };
      } else {
        throw new HttpException('您输入的密码错误!', 200);
      }
    } else {
      throw new HttpException('该用户名不存在!', 200);
    }
  }

  /**
   * 微信登录 通过code appId 换取AccessToken 通过AccessToken 请求微信接口 拉去微信用户信息
   */
  async loginWithWechat(code) {
    if (!code) {
      throw new BadRequestException('请输入微信授权码');
    }
    const APPID = this.configService.get('APPID');
    const APPSECRET = this.configService.get('APPSECRET');
    if (!APPSECRET) {
      throw new BadRequestException('[getAccessToken]必须有appSecret');
    }
    if (
      !this.accessTokenInfo ||
      (this.accessTokenInfo && this.isExpires(this.accessTokenInfo))
    ) {
      // 请求accessToken数据
      const res: AxiosResponse<WechatError & AccessConfig, any> =
        await lastValueFrom(
          this.httpService.get(
            `${this.apiServer}/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`,
          ),
        );

      if (res.data.errcode) {
        throw new BadRequestException(
          `[getAccessToken] errcode:${res.data.errcode}, errmsg:${res.data.errmsg}`,
        );
      }
      this.accessTokenInfo = {
        accessToken: res.data.access_token,
        expiresIn: res.data.expires_in,
        getTime: Date.now(),
        openid: res.data.openid,
      };
    }
    const userDoc = await this.userRepository.findOne(
      this.accessTokenInfo.openid,
    );
    if (!userDoc) {
      // 获取微信用户信息，注册新用户
      const userInfo: WechatUserInfo = await this.getWechatUserInfo();
      const user = new User();
      user.username = userInfo.nickname;
      user.password = userInfo.nickname;
      user.nickname = userInfo.nickname;
      user.phone = userInfo.nickname;
      await this.userRepository.save(user);
    }
    return this.login(userDoc);
  }

  isExpires(access) {
    return Date.now() - access.getTime > access.expiresIn * 1000;
  }

  async getWechatUserInfo() {
    const result: AxiosResponse<WechatError & WechatUserInfo> =
      await lastValueFrom(
        this.httpService.get(
          `${this.apiServer}/sns/userinfo?access_token=${this.accessTokenInfo.accessToken}&openid=${this.accessTokenInfo.openid}`,
        ),
      );
    if (result.data.errcode) {
      throw new BadRequestException(
        `[getUserInfo] errcode:${result.data.errcode}, errmsg:${result.data.errmsg}`,
      );
    }
    console.log('result', result.data);
    return result.data;
  }

  /**
   * 用户注册(只有手机号注册一种方式)手机号作为用户名
   * @param registerDTO
   * @returns
   */
  async register(registerDTO: RegisterDTO): Promise<any> {
    const { nickname, phone, verificationCode, password } = registerDTO;
    const doc = await this.userRepository.findOne({ username: phone });
    if (doc) {
      throw new HttpException('用户已存在', 200);
    }
    if (verificationCode === this.verificationCodeMap[phone]) {
      this.verificationCodeMap.delete(phone);
    } else {
      throw new HttpException('验证码输入错误！', 200);
    }
    const user = new User();
    user.username = phone;
    user.password = password;
    user.nickname = nickname;
    user.phone = phone;
    user.intro = `我是${phone}`;
    return await this.userRepository.save(user);
  }

  // 获取验证码给前端
  async sendVerificationCode(body: any): Promise<any> {
    // 手机号
    const { phone } = body;
    // 后台随机生成验证码
    const verificationCode = createCode();
    console.log(verificationCode);
    const doc = await this.userRepository.findOne({ username: phone });
    if (doc) {
      throw new HttpException('该手机号已被注册!', 200);
    }
    const result = await this.smsService.sendVerificationCode(
      phone,
      verificationCode,
    );
    if (result === true) {
      this.verificationCodeMap[phone] = verificationCode;
      return '验证码发送成功！';
    } else {
      throw new HttpException('验证码发送失败!' + result.toString(), 200);
    }
  }

  /**
   *
   * @param request
   * 获取用户信息
   */
  async getUserInfo(request: any): Promise<any> {
    const id = request.user.userId;
    return await this.userRepository.findOne(id);
  }

  // 删除用户
  async deleteUser(id: number | string): Promise<any> {
    return await this.userRepository.delete(id);
  }

  // 更新用户信息
  async updateUserInfo(body: UpdateDTO, request: any): Promise<any> {
    const updateObj = {};
    Object.keys(body).map((param) => {
      updateObj[param] = body[param];
    });
    return await this.userRepository.update(request.user.userId, updateObj);
  }

  // 更新指定用户角色
  async setRole(body: any): Promise<any> {
    const { userId, role } = body;
    return await this.userRepository.update(userId, { role });
  }

  // 分页查询用户列表
  async userList(body: any): Promise<any> {
    const { nickname, pageIndex, pageSize } = body;
    const [users, count] = await this.userRepository.findAndCount({
      where: {
        nickname: Like(`%${nickname}%`),
      },
      cache: true,
      order: {
        createDate: 'ASC', //ASC 按时间正序 DESC 按时间倒序
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return {
      list: users,
      total: count,
    };
  }
}
