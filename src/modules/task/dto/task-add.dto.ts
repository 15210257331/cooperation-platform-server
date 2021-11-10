import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class TaskAddDTO {
    @IsNotEmpty({ message: '任务名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '任务内容不能为空' })
    readonly content: string;

    @IsNotEmpty({ message: '任务内容不能为空' })
    @IsNumber()
    readonly projectId: number;

    @IsNotEmpty({ message: '标签不能为空' })
    @IsNumber()
    readonly tags: number[];

    @IsNotEmpty({ message: '任务类型不能为空' })
    @IsNumber()
    readonly type: number;

}
