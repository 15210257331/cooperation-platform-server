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
import { HttpService } from '@nestjs/axios';
import { UpdateDTO } from './dto/update.dto';
import { Role } from './entity/role.entity';

@Injectable()
export class UserService {
  // 手机号---验证码 map
  private verificationCodeMap: Map<string, string> = new Map<string, string>();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private smsService: SmsService,
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  // 登录
  async login(loginDTO: LoginDTO): Promise<any> {
    const { username, password } = loginDTO;
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['roles'],
    });
    if (user) {
      // 加密后的密码
      const hashPwd = encryptPassword(password);
      console.log(hashPwd);
      if (user.password === hashPwd) {
        const payload = {
          username: username,
          userId: user.id,
          roles: user.roles, // 当前用户的角色 用于接口权限的验证
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
    return await this.userRepository.findOne(id, {
      relations: ['roles'],
    });
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
      relations: ['roles'],
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return {
      list: users,
      total: count,
    };
  }

  // 分页查询角色列表
  async roleList(body: any): Promise<any> {
    const { name, pageIndex, pageSize } = body;
    const [users, count] = await this.roleRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
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

  // 添加角色
  async roleAdd(body: any): Promise<any> {
    const { name, description } = body;
    const role = new Role();
    role.name = name;
    role.description = description;
    return await this.roleRepository.save(role);
  }

  // 修改角色
  async roleUpdate(body: any): Promise<any> {
    const { id, name, description } = body;
    return await this.roleRepository.update(id, { name, description });
  }

  // 删除角色
  async roleDelete(id: string): Promise<any> {
    return await this.roleRepository.delete(id);
  }

  // 更新指定用户角色
  async setRole(body: any): Promise<any> {
    const { userId, roleIds } = body;
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    user.roles = await this.roleRepository.findByIds(roleIds);
    return await this.userRepository.save(user);
  }

  // 设置角色权限
  async roleSetPermission(body: any): Promise<any> {
    const { roleId, permission } = body;
    return await this.roleRepository.update(roleId, { permission });
  }

  /** 用户任务完成排行 */
  async rank(type: number): Promise<any> {
    let users = await this.userRepository.find({
      relations: ['tasks'],
    });
    let data = users.map((user, index) => {
      const total = user.tasks.length;
      const complete = user.tasks.filter(
        (task) => task.complete === true,
      ).length;
      const percent =
        total > 0 ? parseFloat((complete / total).toFixed(2)) * 100 : 0;
      return {
        nickname: user.nickname,
        total: total,
        complete: complete,
        percent: percent,
      };
    });
    if (type === 1) {
      data.sort((a, b) => b.total - a.total);
    } else {
      data.sort((a, b) => b.percent - a.percent);
    }
    if (users.length > 5) {
      data = data.slice(0, 5);
    }
    return data;
  }
}
