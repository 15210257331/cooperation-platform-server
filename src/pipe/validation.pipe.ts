/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Logger } from '../config/log.config';


/**
 * 管道有两个类型:
 * 转换：管道将输入数据转换为所需的数据输出
 * 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const msg = Object.values(errors[0].constraints)[0];
            Logger.error(`Validation failed: ${msg}`);
            throw new BadRequestException(`Validation failed: ${msg}`);
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
