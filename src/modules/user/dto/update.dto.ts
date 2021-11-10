import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty({ message: '昵称不能为空' })
    @IsString({ message: '昵称必须是 String 类型' })
    readonly nickname: string;

    @IsNotEmpty({ message: '头像地不能为空' })
    readonly avatar: string;

    readonly introduction: string;

}
