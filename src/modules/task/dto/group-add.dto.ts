import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GroupAddDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '分组名称不能为空' })
    readonly name: string;
}
