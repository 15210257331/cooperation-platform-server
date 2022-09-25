import { SetMetadata } from '@nestjs/common';

/** 角色装饰器
 *  在路由控制器上使用该装饰器给装饰器添加设定的元数据
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
