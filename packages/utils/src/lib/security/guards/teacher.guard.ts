import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRoles } from '@v/libs-contracts';

@Injectable()
export class TeacherGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let user: any;
    if (context.getType<'http' | 'ws'>() === 'http') {
      const req = context.switchToHttp().getRequest();
      user = req.user;
    } else {
      const client = context.switchToWs().getClient();
      user = (client as any).user;
    }

    if (
      !user ||
      (!user.roles?.includes(UserRoles.teacher) &&
        !user.roles.includes(UserRoles.manager))
    ) {
      throw new ForbiddenException('Teacher/Manager role required');
    }

    return true;
  }
}
