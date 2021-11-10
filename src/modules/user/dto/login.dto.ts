import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty({ message: '用户名不能为空' })
    readonly username: string;
    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string;
}

