import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import {
  AccessTokenInfo,
  WechatError,
  WechatUserInfo,
  AccessConfig,
} from './wechat.interface';

@Injectable()
export class WechatService {
  // 微信accessToken信息
  private accessTokenInfo: AccessTokenInfo;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userService: UserService,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 跳转到github 授权界面
   */
  async wechatAuthorize(): Promise<any> {
    const APPID = this.configService.get('secretId');
    const host = this.configService.get('HOST');
    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${host}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    // const redirectUri = urlencode(host);
    // res.redirect(
    //   `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
    // );
    return await Promise.resolve(url);
  }

  /**
   * 微信登录
   * 通过code appId 换取AccessToken 通过AccessToken 请求微信接口 拉去微信用户信息
   * @param code
   * @returns
   */
  async wechatLogin(code: string): Promise<any> {
    if (!code) {
      throw new HttpException('请输入微信授权码', 200);
    }
    const APPID = this.configService.get('APPID');
    const APPSECRET = this.configService.get('APPSECRET');
    if (!APPSECRET) {
      throw new HttpException('[getAccessToken]必须有appSecret', 200);
    }
    if (
      !this.accessTokenInfo ||
      (this.accessTokenInfo && this.isExpires(this.accessTokenInfo))
    ) {
      // 请求accessToken数据
      const api = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`;
      const res: AxiosResponse<WechatError & AccessConfig, any> =
        await lastValueFrom(this.httpService.get(api));
      if (res.data.errcode) {
        throw new HttpException(`[getAccessToken]err:${res.data.errmsg}`, 200);
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
    return {
      token: this.jwtService.sign({
        username: userDoc.username,
        userId: userDoc.id,
        // role: userDoc.role,
      }),
      userInfo: userDoc,
    };
  }

  async getWechatUserInfo() {
    const api = `https://api.weixin.qq.com/sns/userinfo?access_token=${this.accessTokenInfo.accessToken}&openid=${this.accessTokenInfo.openid}`;
    const result: AxiosResponse<WechatError & WechatUserInfo> =
      await lastValueFrom(this.httpService.get(api));
    if (result.data.errcode) {
      throw new HttpException(`getUserInfo:${result.data.errmsg}`, 200);
    }
    console.log('result', result.data);
    return result.data;
  }

  isExpires(access) {
    return Date.now() - access.getTime > access.expiresIn * 1000;
  }
}
