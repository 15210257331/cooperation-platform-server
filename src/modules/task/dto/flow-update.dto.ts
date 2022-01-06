import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class FlowUpdateDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '分组ID不能为空' })
    @IsNumber()
    readonly id: number;

    @ApiProperty()
    @IsNotEmpty({ message: '节点名称不能为空' })
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty({ message: '节点排序不能为空' })
    @IsNumber()
    readonly sort: number;

    @ApiProperty()
    @IsNotEmpty({ message: '节点流转返回不能为空' })
    readonly range: string[];

    @ApiProperty()
    @IsBoolean()
    readonly canNew: boolean;
}
