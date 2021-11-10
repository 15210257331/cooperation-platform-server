/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
/**
 * jwt策略用来解析并验证token JwtStrategy本身是一个守卫
 * *
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, //是否忽略过期时间，正常是false，不忽略过期 
            secretOrKey: 'simple-pm-nest',
        });
    }
    /**
     * 对于 JWT 策略，Passport 首先验证 JWT 的签名并自动解析token为json
     * validate 的payload参数就是解析完成之后的token
     * Passport 将基于 validate() 方法的返回值构建一个user 对象，并将其作为属性附加到请求对象上。
     */
    async validate(payload: any) {
        // console.log('执行了 JwtStrategy');
        // console.log(payload)
        // 无需处理 直接返回
        return payload;
    }
}
