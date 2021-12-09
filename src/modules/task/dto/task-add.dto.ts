import { group } from 'console';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class TaskAddDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '任务名称不能为空' })
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty({ message: '任务详情不能为空' })
    readonly detail: string;

    @IsNotEmpty({ message: '分组ID不能为空' })
    @IsNumber()
    readonly groupId: number;

    @ApiProperty()
    @IsNotEmpty({ message: '任务优先级' })
    readonly priority: number;

    @ApiProperty()
    @IsNotEmpty({ message: '任务提醒' })
    readonly reminder: string;

    @ApiProperty()
    @IsNotEmpty({ message: '工作量' })
    readonly workload: number;

    @ApiProperty()
    @IsNotEmpty({ message: '开始时间不能为空' })
    readonly startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: '截止时间不能为空' })
    readonly endDate: Date;

    @ApiProperty()
    readonly subItems: string;

    @IsString()
    readonly pictures: string;

}
