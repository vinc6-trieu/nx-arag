export class LoginRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class LoginResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: UserDto,
    public readonly mustChangePassword?: boolean,
  ) {}
}

export class RegisterRequestDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name?: string,
    public readonly phone?: string,
    public readonly roles?: string[],
    public readonly studentCode?: string,
    public readonly grade?: string,
    public readonly className?: string,
    public readonly schoolLevel?: string,
    public readonly origin?: string,
  ) {}
}

export class UpdateProfileRequestDto {
  constructor(
    public readonly name?: string,
    public readonly phone?: string,
    public readonly avatar?: string,
    public readonly studentCode?: string,
    public readonly grade?: string,
    public readonly className?: string,
    public readonly schoolLevel?: string,
    public readonly roles?: string[],
  ) {}
}

export class ChangePasswordRequestDto {
  constructor(
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) {}
}

export class UserDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly roles: string[],
    public readonly name?: string,
    public readonly phone?: string,
    public readonly avatar?: string,
    public readonly origin?: string,
    public readonly organization?: any,
  ) {}
}

export class AADProfileDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name?: string,
    public readonly given_name?: string,
    public readonly family_name?: string,
    public readonly picture?: string,
  ) {}
}

export class GoogleLoginDto {
  constructor(public readonly idToken: string) {}
}
