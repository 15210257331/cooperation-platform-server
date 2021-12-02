import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NoteAddDTO {
    @IsNotEmpty({ message: '角色名称不能为空' })
    readonly title: string;
    @IsNotEmpty({ message: '角色描述不能为空' })
    readonly content: string;
}

