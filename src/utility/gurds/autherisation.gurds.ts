import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AutheriseGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const allowedRoles = this.reflector.get<string[]>(
        'allowedRoles',
        context.getHandler(),
      );
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles
        .map((role: string) => allowedRoles.includes(role))
        .find((result: boolean) => result === true);
      if (result) return true;
    } catch (error) {
      throw new UnauthorizedException('You are not authorized to access');
    }
    return false;
  }
}
