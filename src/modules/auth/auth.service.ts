import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../role/user.entity';
import { Repository } from 'typeorm';
// JwtService 不是全局服务 只有引入JwtModule 的模块才可以使用JwtService
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    /**
    * 进行用户验证
    * @param username 
    * @param password 
    */
    public async validatePassword(username: string, password: string): Promise<any> {
        const doc = await this.userRepository.findOne({ username: username });
        if (doc && doc.password === password) {
            const { password, ...result } = doc;
            return result;
        }
        return null;
    }
}
