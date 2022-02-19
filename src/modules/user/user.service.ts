import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entity/user.entity';
import { Repository, Like, Any } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { makeSalt, encryptPassword } from '../../utils/utils';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Role } from '../../common/entity/role.entity';
import { createCode } from "../../utils/utils"
import { ConfigService } from '@nestjs/config';
const tencentcloud = require("tencentcloud-sdk-nodejs");
const smsClient = tencentcloud.sms.v20210111.Client;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    salt = 'todo'; // 制作密码盐

    phoneCodeList = [];

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
            const hashPwd = encryptPassword(password, this.salt); // 加密后的密码
            if (user.password === hashPwd) {
                const payload = {
                    username: username,
                    userId: user.id
                }
                return {
                    data: {
                        // 生成token
                        token: this.jwtService.sign(payload),
                        roles: user.roles,
                        userId: user.id
                    },
                    message: '登录成功！'
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
        const { nickname, phone, verificationCode, password } = registerDTO;
        const doc = await this.userRepository.findOne({ username: phone });
        if (doc) {
            return {
                code: 9999,
                message: '用户已存在'
            }
        }
        if (verificationCode === this.phoneCodeList[phone]) {
            this.phoneCodeList = [];
        } else {
            return {
                code: 9999,
                message: '验证码输入错误！'
            }
        }
        const hashPwd = encryptPassword(password, this.salt); // 加密后的密码
        const user = new User();
        user.username = phone;
        user.password = hashPwd;
        user.nickname = nickname;
        user.email = `${phone}@163.com`;
        user.phone = phone;
        user.sex = 1;
        user.introduction = '';
        user.roles = []
        await this.userRepository.insert(user);
        return {
            data: '注册成功！',
        };
    }

    /**
     * 
     * @param request 
     * 获取验证码
     */
    async code(body: any): Promise<any> {
        const { phone } = body;
        const doc = await this.userRepository.findOne({ username: phone });
        if (doc) {
            // return {
            //     code: 9999,
            //     message: '该手机号已被注册',
            //     data: '该手机号已被注册!'
            // }
        }
        // 验证码
        const code = createCode();
        /* 实例化要请求产品(以sms为例)的client对象 */
        const client = new smsClient({
            credential: {
                /* 必填：腾讯云账户密钥对secretId，secretKey。
                 * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
                 * 你也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
                 * 以免泄露密钥对危及你的财产安全。 */
                secretId: this.configService.get('secretId'),
                secretKey: this.configService.get('secretKey'),
            },
            /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
            region: "ap-guangzhou",
            /* 非必填:
             * 客户端配置对象，可以指定超时时间等配置 */
            profile: {
                /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
                signMethod: "HmacSHA256",
                httpProfile: {
                    /* SDK默认使用POST方法。
                     * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
                    reqMethod: "POST",
                    /* SDK有默认的超时时间，非必要请不要进行调整
                     * 如有需要请在代码中查阅以获取最新的默认值 */
                    reqTimeout: 30,
                    /**
                     * SDK会自动指定域名。通常是不需要特地指定域名的，但是如果你访问的是金融区的服务
                     * 则必须手动指定域名，例如sms的上海金融区域名： sms.ap-shanghai-fsi.tencentcloudapi.com
                     */
                    endpoint: "sms.tencentcloudapi.com"
                },
            },
        })

        /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
         * 属性可能是基本类型，也可能引用了另一个数据结构
         * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
        const params = {
            /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
            SmsSdkAppId: "1400633837",
            /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看 */
            SignName: "陈晓飞学些Linux",
            /* 短信码号扩展号: 默认未开通，如需开通请联系 [sms helper] */
            ExtendCode: "",
            /* 国际/港澳台短信 senderid: 国内短信填空，默认未开通，如需开通请联系 [sms helper] */
            SenderId: "",
            /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
            SessionContext: "",
            /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
             * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
            PhoneNumberSet: [`+86${phone}`],
            /* 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看 */
            TemplateId: "1305190",
            /* 模板参数: 若无模板参数，则设置为空*/
            TemplateParamSet: [code, '5'],
        }
        const result = await client.SendSms(params);
        this.phoneCodeList[phone] = code;
        if (result?.SendStatusSet[0].Code === 'Ok') {
            return {
                data: '验证码发送成功'
            }
        }
    }

    /**
     * 
     * @param request 
     * 获取用户信息
     */
    async getUserInfo(request: any): Promise<any> {
        const id = request.user.userId;
        const data = await this.userRepository.findOne(id, {
            relations: ['roles'],
        });
        return { data }
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
        const [users, count] = await this.userRepository.findAndCount({
            where: {
                'nickname': Like(`%${name}%`),
            },
            relations: ['roles', "tasks"],
            cache: true,
            order: {
                createDate: 'ASC' //ASC 按时间正序 DESC 按时间倒序
            },
            skip: (page - 1) * size,
            take: size,
        })
        const doc = users.map(item => {
            let total = item.tasks.length;
            let complete = item.tasks.filter(sonItem => sonItem).length;
            let percent = total > 0 ? parseFloat((complete / total).toFixed(2)) * 100 : 0
            return Object.assign({}, item, {
                avatar: item.avatar,
                nickname: item.nickname,
                email: item.email,
                total: total,
                complete: complete,
                percent: percent
            })
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


    /**
     * top10
     */
    async top10(): Promise<any> {
        const users = await this.userRepository.find({
            relations: ["tasks"],
        });
        let doc = users.map(item => {
            let total = item.tasks.length;
            let complete = item.tasks.filter(sonItem => sonItem).length;
            let percent = total > 0 ? parseFloat((complete / total).toFixed(2)) * 100 : 0
            return Object.assign({}, {
                avatar: item.avatar,
                nickname: item.nickname,
                email: item.email,
                total: total,
                complete: complete,
                percent: percent
            })
        })
        doc.sort((a, b) => {
            return b.total - a.total;
        })
        doc = doc.slice(0, 10)
        return {
            data: doc,
        };
    }


}
