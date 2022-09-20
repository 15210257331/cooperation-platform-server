import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlowDto {
  @ApiProperty()
  @IsNotEmpty({ message: '项目ID不能为空' })
  @IsNumber()
  readonly projectId: number;

  @ApiProperty()
  @IsNotEmpty({ message: '流程名称不能为空' })
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '节点排序不能为空' })
  @IsNumber()
  readonly sort: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'canNew参数不能为空' })
  @IsBoolean()
  readonly canNew: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'complete参数不能为空' })
  @IsBoolean()
  readonly complete: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: '节点流转范围不能为空' })
  readonly range: string[];
}
