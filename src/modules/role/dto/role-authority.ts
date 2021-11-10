import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoleAuthorityDTO {
    @IsNotEmpty({ message: 'id不能为空' })
    readonly id: number;

    readonly authority: any;
}

