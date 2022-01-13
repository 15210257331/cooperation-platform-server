import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class FlowAddDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '流程名称不能为空' })
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty({ message: '节点排序不能为空' })
    @IsNumber()
    readonly sort: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'complete参数不能为空' })
    @IsBoolean()
    readonly complete: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: '节点流转返回不能为空' })
    readonly range: string[];
}
