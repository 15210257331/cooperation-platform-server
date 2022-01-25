import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NoteUpdateDTO {
    @IsNotEmpty({ message: 'ID不能为空' })
    readonly id: string;

    @IsNotEmpty({ message: 'title不能为空' })
    readonly title: string;

    @IsNotEmpty({ message: 'content不能为空' })
    readonly content: string;

    @IsBoolean()
    readonly publish: boolean;


    readonly cover: string;

    readonly overview: string;
}

