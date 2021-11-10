import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ProjectAddDTO {
    @IsNotEmpty({ message: '项目名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '项目内容不能为空' })
    readonly content: string;

    @IsNotEmpty({ message: '项目成员不能为空' })
    readonly member: string[];

}
