import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * 守卫
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /** 获取使用了@Role装饰器 装饰了地路由处理器上的元数据 */
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // 读取user 从user中拿出role
    const req = context.switchToHttp().getRequest();
    // console.log(req.user);
    // console.log(roles);
    const user = req.user;
    if (!user) {
      return false;
    }
    // 判断用户的角色是否包含和roles相同的角色列表，并返回一个布尔类型
    const hasRoles = roles.some((role) => role === user.role);
    return hasRoles;
  }
}
