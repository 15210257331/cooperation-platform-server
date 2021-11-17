/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { Repository, Like } from 'typeorm';
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

    async login(loginDTO: LoginDTO): Promise<any> {
        const { username, password } = loginDTO;
        const doc = await this.userRepository.findOne({ username: username });
        if (doc) {
            if (doc.password === password) {
                const payload = {
                    username: username,
                    userId: doc.id
                }
                return {
                    code: 10000,
                    msg: '登录成功',
                    // 生成token
                    token: this.jwtService.sign(payload),
                }
            } else {
                return {
                    code: 9999,
                    msg: '密码错误',
                }
            }
        } else {
            return {
                code: 9999,
                msg: '用户名不存在',
            }
        }
    }

    /**
     * 
     * @param request 
     * 获取用户信息
     */
    async getUserInfo(request: any): Promise<any> {
        try {
            const id = request.user.userId;
            const doc = await this.userRepository.findOne(id, {
                relations: ['roles'],
            });
            return {
                code: 10000,
                data: doc,
                msg: 'success'
            }
        } catch (error) {
            return {
                code: 9999,
                msg: error
            }
        }
    }

    async updateUserInfo(request: any): Promise<any> {
        try {
            const doc = await this.userRepository.update(request.user.userId, {
                nickname: request.body.nickname,
                username: request.body.username,
                email: request.body.email,
                avatar: request.body.avatar,
                introduction: request.body.introduction
            });
            return {
                code: 10000,
                data: '更新成功',
                msg: 'success'
            }
        } catch (error) {
            return {
                code: 999,
                msg: error
            }
        }
    }

    async register(registerDTO: RegisterDTO): Promise<any> {
        const doc = await this.userRepository.findOne({ username: registerDTO.username });
        if (doc) {
            return {
                code: 9999,
                msg: '用户已存在'
            }
        }
        const salt = makeSalt(); // 制作密码盐
        const hashPwd = encryptPassword(registerDTO.password, salt); // 加密后的密码
        try {
            const data = new User();
            data.username = registerDTO.username;
            data.password = registerDTO.password;
            data.nickname = registerDTO.nickname;
            data.email = registerDTO.email;
            data.phone = registerDTO.phone;
            data.sex = 1;
            data.introduction = registerDTO.introduction;
            data.roles = []
            await this.userRepository.insert(data);
            return {
                code: 10000,
                msg: 'Success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    // 分页查询用户列表
    async userList(body: any): Promise<any> {
        try {
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
                code: 10000,
                data: {
                    list: doc,
                    total: count
                },
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    // 查询所有用户
    async all(body: any): Promise<any> {
        try {
            const doc = await this.userRepository.find({
                cache: true,
                order: {
                    createDate: 'DESC'
                },
            })
            return {
                code: 10000,
                data: doc,
                msg: 'success',
            };
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }

    async setRole(body: any): Promise<any> {
        try {
            const { userId, roleIds } = body;
            const roles = await this.roleRepository.findByIds(roleIds);
            const user = await this.userRepository.findOne(userId);
            user.roles = roles;
            const doc = await this.userRepository.save(user);
            if (doc) {
                return {
                    code: 10000,
                    data: doc,
                    msg: 'success'
                }
            }
        } catch (error) {
            return {
                code: 9999,
                msg: error,
            };
        }
    }
}
