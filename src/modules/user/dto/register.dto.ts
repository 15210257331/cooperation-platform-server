import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {

    @IsNotEmpty({ message: '昵称不能为空' })
    @IsString({ message: '昵称必须是 String 类型' })
    readonly nickname: string;

    @IsNotEmpty({ message: '手机号不能为空' })
    readonly phone: string;

    @IsNotEmpty({ message: '验证码不能为空！' })
    readonly verificationCode: string;

    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string;

}
