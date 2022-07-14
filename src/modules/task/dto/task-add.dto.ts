import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskAddDTO {
  @ApiProperty()
  @IsNotEmpty({ message: '任务名称不能为空' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '任务描述不能为空' })
  readonly description: string;

  @IsNotEmpty({ message: '流程ID不能为空' })
  @IsNumber()
  readonly flowId: number;

  @ApiProperty()
  @IsNotEmpty({ message: '任务优先级不能为空' })
  readonly priority: string;

  @ApiProperty()
  readonly reminder: number;

  @ApiProperty()
  @IsNotEmpty({ message: '开始时间不能为空' })
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: '截止时间不能为空' })
  readonly endDate: Date;
}
