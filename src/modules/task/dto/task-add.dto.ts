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
  @IsString()
  readonly flowId: string;

  @ApiProperty()
  @IsNotEmpty({ message: '任务优先级不能为空' })
  readonly priority: string;

  @ApiProperty()
  @IsNotEmpty({ message: '迭代不能为空' })
  readonly iteration: string;

  @ApiProperty()
  readonly remind: number;

  @ApiProperty()
  readonly tagIds: string[];

  @ApiProperty()
  @IsNotEmpty({ message: '开始时间不能为空' })
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: '结束时间不能为空' })
  readonly endDate: Date;
}
