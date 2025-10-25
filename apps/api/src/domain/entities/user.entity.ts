export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name?: string,
    public readonly password?: string,
    public readonly passwordUpdated: boolean = false,
    public readonly googleId?: string,
    public readonly azureAdId?: string,
    public readonly phone?: string,
    public readonly campusCode?: string,
    public readonly avatar?: string,
    public readonly roles: string[] = [],
    public readonly origin?: string,
    public readonly dateOfBirth?: string,
    public readonly organizationId?: string,
    public readonly createdAt: Date = new Date(),
    public readonly student?: StudentProfile,
    public readonly teacher?: TeacherProfile,
    public readonly parent?: ParentProfile,
    public readonly organization?: Organization,
  ) {}

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }

  isParent(): boolean {
    return this.hasRole('parent');
  }

  canAccessUser(targetUserId: string): boolean {
    return this.id === targetUserId || this.isAdmin();
  }
}

export class StudentProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly studentCode?: string,
    public readonly grade?: string,
    public readonly className?: string,
    public readonly schoolLevel?: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class TeacherProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly homeroomClasses: string[] = [],
    public readonly teachingGrades: string[] = [],
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class ParentProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly domain?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export enum UserRoles {
  admin = 'admin',
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
  guest = 'guest',
}
