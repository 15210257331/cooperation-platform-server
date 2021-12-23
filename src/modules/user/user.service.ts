import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { Repository, Like, Any } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { makeSalt, encryptPassword } from '../../utils/utils';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Role } from '../../common/entity/role.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private readonly jwtService: JwtService,
    ) { }

    // 登录
    async login(loginDTO: LoginDTO): Promise<any> {
        const { username, password } = loginDTO;
        const doc = await this.userRepository.findOne({
            where: {
                username: username,
            },
            relations: ['roles'],
        });
        if (doc) {
            if (doc.password === password) {
                const payload = {
                    username: username,
                    userId: doc.id
                }
                return {
                    data: {
                        // 生成token
                        token: this.jwtService.sign(payload),
                        roles: doc.roles,
                        userId: doc.id
                    }
                }
            } else {
                return {
                    code: 9999,
                    message: '您输入的密码错误',
                    data: "您输入的密码错误!"
                }
            }
        } else {
            return {
                code: 9999,
                message: '该用户名不存在',
                data: '该用户名不存在!'
            }
        }
    }

    /**
     * 注册
     * @param registerDTO 
     * @returns 
     */
    async register(registerDTO: RegisterDTO): Promise<any> {
        const doc = await this.userRepository.findOne({ username: registerDTO.username });
        if (doc) {
            return {
                code: 9999,
                message: '用户已存在'
            }
        }
        const salt = makeSalt(); // 制作密码盐
        const hashPwd = encryptPassword(registerDTO.password, salt); // 加密后的密码
        const data = new User();
        data.username = registerDTO.username;
        // data.password = registerDTO.password;
        data.password = hashPwd;
        data.nickname = registerDTO.nickname;
        data.email = registerDTO.email;
        data.phone = registerDTO.phone;
        data.sex = 1;
        data.introduction = registerDTO.introduction;
        data.roles = []
        await this.userRepository.insert(data);
        return {
            data: data
        };
    }

    /**
     * 
     * @param request 
     * 获取用户信息
     */
    async getUserInfo(request: any): Promise<any> {
        const id = request.user.userId;
        const doc = await this.userRepository.findOne(id, {
            relations: ['roles'],
        });
        return {
            data: doc,
        }
    }

    // 删除用户
    async deleteUser(id: number | string): Promise<any> {
        const doc = await this.userRepository.delete(id)
        return {
            data: doc,
        };
    }

    // 更新用户信息
    async updateUserInfo(body: any, request: any): Promise<any> {
        const { nickname, username, email, avatar, introduction } = body;
        const doc = await this.userRepository.update(request.user.userId, {
            nickname: nickname,
            username: username,
            email: email,
            avatar: avatar,
            introduction: introduction
        });
        return {
            data: doc,
        }
    }

    // 分页查询用户列表
    async userList(body: any): Promise<any> {
        const { name, page, size } = body;
        const [doc, count] = await this.userRepository.findAndCount({
            where: {
                'nickname': Like(`%${name}%`),
            },
            relations: ['roles'],
            cache: true,
            order: {
                createDate: 'DESC' //ASC 按时间正序 DESC 按时间倒序
            },
            skip: (page - 1) * size,
            take: size,
        })
        return {
            data: {
                list: doc,
                total: count
            },
        };
    }

    /**
     * 为用户设置角色
     * @param body 
     * @returns 
     */
    async setRole(body: any, request: any): Promise<any> {
        const { userId, roleIds } = body;
        const user = await this.userRepository.findOne(userId);
        const roles = await this.roleRepository.findByIds(roleIds);
        user.roles = roles;
        const doc = await this.userRepository.save(user);
        return {
            data: doc,
        };
    }

    /**
     * 查询用户角色
     * @param body 
     * @returns 
     */
    async getRole(id: number): Promise<any> {
        const doc = await this.userRepository.findOne(id, {
            relations: ['roles'],
        });
        return {
            data: doc,
        };
    }
}
