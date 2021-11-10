import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty({ message: '用户名不能为空' })
    readonly username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string;

    @IsNotEmpty({ message: '昵称不能为空' })
    @IsString({ message: '昵称必须是 String 类型' })
    readonly nickname: string;

    @IsNotEmpty({ message: '重复密码不能为空' })
    readonly repassword: string;

    @IsNotEmpty({ message: '手机号不能为空' })
    @IsNumber()
    readonly phone: number;

    @IsNotEmpty({ message: '邮箱不能为空' })
    readonly email: string;

    readonly introduction: string;

}
