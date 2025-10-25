import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRoles } from 'packages/libs/contracts/src';

@Injectable()
export class ManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let user: any;
    if (context.getType<'http' | 'ws'>() === 'http') {
      const req = context.switchToHttp().getRequest();
      user = req.user;
    } else {
      const client = context.switchToWs().getClient();
      user = (client as any).user;
    }

    if (!user || !user.roles.includes(UserRoles.manager)) {
      throw new ForbiddenException('Manager role required');
    }

    return true;
  }
}
