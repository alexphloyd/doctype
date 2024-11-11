import { JwtService } from '@nestjs/jwt';
import { getBearerToken } from '~/application/auth/lib/extract-token';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  private matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const bearer = getBearerToken(request);

    if (!bearer) return false;
    try {
      const { role } = this.jwtService.verify(bearer);
      return this.matchRoles(roles, role);
    } catch {
      throw new HttpException('Invalid token', 403);
    }
  }
}
