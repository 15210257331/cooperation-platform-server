import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateDTO {
  @ApiProperty()
  @IsString({ message: '昵称必须是 String 类型' })
  readonly nickname: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly intro: string;
}
