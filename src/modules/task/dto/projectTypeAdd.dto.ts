import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ProjectTypeAddDTO {
    @IsNotEmpty({ message: '类型名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '项目ID不能为空' })
    readonly projectId: number;

}
