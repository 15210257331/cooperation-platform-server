import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '昵称不能为空' })
    @IsString({ message: '昵称必须是 String 类型' })
    readonly nickname: string;

    @ApiProperty()
    @IsNotEmpty({ message: '头像不能为空' })
    readonly avatar: string;

}
