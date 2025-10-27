import { User } from '../entities/user.entity';

export class AuthDomainService {
  static validateUserAccess(currentUser: User, targetUserId: string): boolean {
    return currentUser.canAccessUser(targetUserId);
  }

  static hasRequiredRole(user: User, requiredRole: string): boolean {
    return user.hasRole(requiredRole);
  }

  static hasAnyRole(user: User, roles: string[]): boolean {
    return roles.some((role) => user.hasRole(role));
  }

  static canManageUsers(user: User): boolean {
    return user.isAdmin();
  }

  static canAccessData(user: User): boolean {
    if (user.isAdmin()) return true;

    return false;
  }

  static validateRoleTransition(
    currentRoles: string[],
    newRoles: string[],
  ): boolean {
    // Only admins can assign admin roles
    const hasAdminRole = newRoles.includes('admin');
    if (hasAdminRole && !currentRoles.includes('admin')) {
      return false;
    }
    return true;
  }
}
