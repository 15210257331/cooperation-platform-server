import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ProjectUpdateDTO {
    @IsNotEmpty({ message: '项目名称不能为空' })
    readonly name: string;

    @IsNotEmpty({ message: '项目内容不能为空' })
    readonly content: string;

    @IsNotEmpty({ message: '项目封面不能为空' })
    readonly cover: string;

    @IsNotEmpty({ message: '项目id不能为空' })
    readonly id: number;

}
