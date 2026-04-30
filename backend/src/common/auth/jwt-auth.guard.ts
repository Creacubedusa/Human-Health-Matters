import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const header = (req as any).headers?.authorization as string | undefined;
    if (!header?.startsWith('Bearer '))
      throw new UnauthorizedException('missing_token');

    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      (req as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('invalid_token');
    }
  }
}
