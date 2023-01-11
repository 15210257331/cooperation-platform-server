import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GitHubService {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private userService: UserService,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    // this.clientId = '0110b5f3eee82d37afbe';
    // this.clientSecret = '403445681f93b7f3455ee611563dbc80dbfc6676';
    this.redirectUri = 'http://127.0.0.1:8000/redirect';
  }

  /**
   * 跳转到github 授权界面
   */
  async githubAuthorize(): Promise<any> {
    return await Promise.resolve(
      `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`,
    );
  }

  /**
   * 根据得到的code请求github的accessToken
   * @param code 授权成功后返回的授权码
   */
  async githubLogin(code: string): Promise<any> {
    try {
      const url = `https://github.com/login/oauth/access_token?client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${code}`;
      const result = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Accept: 'application/json' },
        }),
      );
      return this.githubUserInfo(result.data.access_token);
    } catch (err) {
      throw new HttpException('登录失败!' + err.toString(), 200);
    }
  }

  /**
   * 根据accessToken 请求用户信息, 执行登录操作
   * @param code
   * @returns
   */
  async githubUserInfo(accessToken: any): Promise<any> {
    try {
      const url = `https://api.github.com/user`;
      const { data } = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: 'Bearer ' + accessToken },
        }),
      );
      const user = await this.userRepository.findOne(data.id);
      if (!user) {
        const userEntity = new User();
        userEntity.username = data.email;
        userEntity.id = data.id;
        userEntity.nickname = data.name;
        userEntity.phone = data.login;
        userEntity.avatar = data.avatar_url;
        userEntity.intro = data.bio
        await this.userRepository.save(userEntity);
      }
      const doc = await this.userRepository.findOne(data.id);
      return {
        token: this.jwtService.sign({
          username: doc.username,
          userId: doc.id,
          role: doc.role
        }),
        userInfo: doc,
      };
    } catch (err) {
      throw new HttpException('登录失败!' + err.toString(), 200);
    }
  }
}
