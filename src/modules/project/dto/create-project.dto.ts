import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '项目图标不能为空' })
  readonly icon: string;

  @ApiProperty()
  readonly cover: string;

  @ApiProperty()
  readonly star: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: '项目类型不能为空' })
  @IsString()
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty({ message: '开始时间不能为空' })
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: '结束时间不能为空' })
  readonly endDate: Date;
}
