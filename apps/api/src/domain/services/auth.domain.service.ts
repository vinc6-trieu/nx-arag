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
    return user.isAdmin() || user.isTeacher();
  }

  static canAccessStudentData(user: User, studentId: string): boolean {
    if (user.isAdmin()) return true;
    if (user.isStudent() && user.id === studentId) return true;
    if (user.isParent()) {
      // Add parent-student relationship check here
      return true; // Simplified for now
    }
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
