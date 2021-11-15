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

}
