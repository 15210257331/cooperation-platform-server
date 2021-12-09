import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GroupUpdateDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '分组ID不能为空' })
    @IsNumber()
    readonly groupId: number | string;

    
    @ApiProperty()
    @IsNotEmpty({ message: '分组名称不能为空' })
    readonly name: string;
}
