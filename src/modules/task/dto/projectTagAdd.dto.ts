import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ProjectTagAddDTO {
    @IsNotEmpty({ message: '标签名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '标签颜色不能为空' })
    readonly color: string;

    @IsNotEmpty({ message: '项目ID不能为空' })
    readonly projectId: number;

}
