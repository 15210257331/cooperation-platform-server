import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIterationDto {
  @ApiProperty()
  @IsNotEmpty({ message: '项目ID不能为空' })
  @IsString()
  readonly projectId: string;

  @ApiProperty()
  @IsNotEmpty({ message: '迭代名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '迭代类型不能为空' })
  readonly type: string;

  @ApiProperty()
  @IsNotEmpty({ message: '迭代内容不能为空' })
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty({ message: '开始时间不能为空' })
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: '结束时间不能为空' })
  readonly endDate: Date;
}
