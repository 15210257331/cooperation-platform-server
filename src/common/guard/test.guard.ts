import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 守卫
 */
@Injectable()
export class TestGuard implements CanActivate {
    canActivate(context: ExecutionContext, ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request) {
            throw new UnauthorizedException();;
        }
        return true;
    }
}
