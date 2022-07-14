import { PartialType } from '@nestjs/mapped-types';
import { CreateFlowDto } from './create-flow.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlowDto extends PartialType(CreateFlowDto) {
    @ApiProperty()
    @IsNotEmpty({ message: '流程ID不能为空' })
    @IsNumber()
    readonly id: number;


    @ApiProperty()
    @IsBoolean()
    readonly canNew: boolean;
}
