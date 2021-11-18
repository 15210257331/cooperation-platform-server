import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '用户名不能为空' })
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string;
}

