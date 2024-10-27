import { PartialType } from '@nestjs/swagger';
import { CreateIterationDto } from './create-iteration.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIterationDto extends PartialType(CreateIterationDto) {
  @ApiProperty()
  @IsNotEmpty({ message: '迭代ID不能为空' })
  @IsString()
  readonly id: string;
}
