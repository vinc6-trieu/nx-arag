import { AppError, ErrorKey } from '@lib/utils';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import type { UserRepository } from '../../../domain/repositories/user.repository.interface';
import {
  LoginRequestDto,
  LoginResponseDto,
  UserDto,
} from '../../dtos/auth.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new AppError(ErrorKey.AUTH_INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw new AppError(ErrorKey.AUTH_PASSWORD_NOT_SET);
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError(ErrorKey.AUTH_INVALID_CREDENTIALS);
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const userDto = this.mapToUserDto(user);

    return new LoginResponseDto(
      accessToken,
      refreshToken,
      userDto,
      user.passwordUpdated,
    );
  }

  private mapToUserDto(user: User): UserDto {
    return new UserDto(
      user.id,
      user.email,
      user.roles,
      user.name,
      user.phone,
      user.avatar,
      user.origin,
      user.organization,
    );
  }
}
