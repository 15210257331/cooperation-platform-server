import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagAddDTO {
  @ApiProperty()
  @IsNotEmpty({ message: '标签名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '项目ID不能为空' })
  readonly projectId: string;
}
