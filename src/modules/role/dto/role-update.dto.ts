import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoleUpdateDTO {
    @IsNotEmpty({ message: '角色名称不能为空' })
    readonly name: string;
    @IsNotEmpty({ message: '角色描述不能为空' })
    readonly description: string;
    @IsNotEmpty({ message: 'id不能为空' })
    readonly id: number;
    @IsArray({ message: '权限列表' })
    readonly authority: Array<string>;

}

