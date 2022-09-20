import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '项目图标不能为空' })
  readonly icon: string;

  @ApiProperty()
  @IsNotEmpty({ message: '项目类型不能为空' })
  @IsNumber()
  readonly type: number;
}
