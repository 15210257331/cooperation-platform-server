import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * local策略 本身是一个守卫 用来验证用户名和密码是否匹配 (本项目未使用直接在user.service 进行验证)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * 
     * @param username 
     * @param password 
     * 
     */
    public async validate(username: string, password: string): Promise<any> {
        console.log('执行了 LocalStrategy' + username + password);
        const user = await this.authService.validatePassword(username, password);
        if (!user) {
            throw new UnauthorizedException(); // 抛出未授权异常
        }
        // validate()方法返回的值自动创建一个对象，并将其分配给Request对象:获取例如：req.user
        return user;
    }
}
