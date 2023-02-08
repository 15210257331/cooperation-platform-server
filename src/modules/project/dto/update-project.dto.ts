import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty()
  @IsNotEmpty({ message: '项目ID不能为空' })
  @IsString()
  readonly id: string;
}
