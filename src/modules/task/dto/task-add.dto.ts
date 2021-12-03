import { group } from 'console';
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class TaskAddDTO {
    @IsNotEmpty({ message: '任务名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '任务详情不能为空' })
    readonly detail: string;

    @IsNotEmpty({ message: '分组ID不能为空' })
    @IsNumber()
    readonly groupId: number;

    @IsNotEmpty({ message: '任务优先级' })
    readonly priority: number;

    @IsNotEmpty({ message: '任务提醒' })
    readonly reminder: boolean;

    @IsNotEmpty({ message: '提醒时间' })
    readonly reminderDate: Date;

    @IsNotEmpty({ message: '工作量' })
    readonly workload: number;

    @IsNotEmpty({ message: '任务详情不能为空' })
    readonly startDate: Date;

    @IsNotEmpty({ message: '分组ID不能为空' })
    readonly endDate: Date;

    readonly subItems: string;
    

    @IsString()
    readonly pictures: string;

}
