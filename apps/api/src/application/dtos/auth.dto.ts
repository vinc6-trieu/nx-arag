import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsEmail()
  readonly email: string;

  @IsArray()
  @IsString({ each: true })
  readonly roles: string[];

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsString()
  readonly origin?: string;

  @IsOptional()
  @IsObject()
  readonly organization?: any;

  constructor(
    id: string,
    email: string,
    roles: string[],
    name?: string,
    phone?: string,
    avatar?: string,
    origin?: string,
    organization?: any,
  ) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.name = name;
    this.phone = phone;
    this.avatar = avatar;
    this.origin = origin;
    this.organization = organization;
  }
}

export class LoginResponseDto {
  @IsString()
  readonly accessToken: string;

  @IsString()
  readonly refreshToken: string;

  @ValidateNested()
  @Type(() => UserDto)
  readonly user: UserDto;

  @IsOptional()
  @IsBoolean()
  readonly mustChangePassword?: boolean;

  constructor(
    accessToken: string,
    refreshToken: string,
    user: UserDto,
    mustChangePassword?: boolean,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    this.mustChangePassword = mustChangePassword;
  }
}

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly roles?: string[];

  @IsOptional()
  @IsString()
  readonly origin?: string;

  constructor(
    email: string,
    password: string,
    name?: string,
    phone?: string,
    roles?: string[],
    origin?: string,
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.roles = roles;
    this.origin = origin;
  }
}

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly roles?: string[];

  constructor(
    name?: string,
    phone?: string,
    avatar?: string,
    roles?: string[],
  ) {
    this.name = name;
    this.phone = phone;
    this.avatar = avatar;
    this.roles = roles;
  }
}

export class ChangePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly currentPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  constructor(currentPassword: string, newPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}

export class AADProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly given_name?: string;

  @IsOptional()
  @IsString()
  readonly family_name?: string;

  @IsOptional()
  @IsString()
  readonly picture?: string;

  constructor(
    id: string,
    email: string,
    name?: string,
    given_name?: string,
    family_name?: string,
    picture?: string,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.given_name = given_name;
    this.family_name = family_name;
    this.picture = picture;
  }
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly idToken: string;

  constructor(idToken: string) {
    this.idToken = idToken;
  }
}
