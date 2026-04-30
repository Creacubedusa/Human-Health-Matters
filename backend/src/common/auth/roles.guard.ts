import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from './auth.types';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    if (!req.user) {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer '))
        throw new UnauthorizedException('missing_token');
      const token = header.slice('Bearer '.length).trim();
      try {
        req.user = await this.jwt.verifyAsync<JwtPayload>(token);
      } catch {
        throw new UnauthorizedException('invalid_token');
      }
    }

    const roleRaw = req.user?.role as string | undefined;
    const role = roleRaw?.toUpperCase();
    const allowed = requiredRoles.map((r) => r.toUpperCase());
    if (!role || !allowed.includes(role))
      throw new ForbiddenException('forbidden');
    return true;
  }
}
