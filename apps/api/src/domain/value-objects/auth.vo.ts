export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export class Password {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private isValid(password: string): boolean {
    return password.length >= 8;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.value;
  }
}

export class UserRole {
  private static readonly VALID_ROLES = [
    'admin',
    'teacher',
    'student',
    'parent',
    'guest',
  ];

  constructor(private readonly value: string) {
    if (!UserRole.VALID_ROLES.includes(value)) {
      throw new Error(`Invalid role: ${value}`);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  static getValidRoles(): string[] {
    return [...UserRole.VALID_ROLES];
  }
}

export class JwtToken {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: JwtToken): boolean {
    return this.value === other.value;
  }
}
