import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import {
  LoginRequestDto,
  LoginResponseDto,
  UserDto,
} from '../../dtos/auth.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.password) {
      throw new Error('User has no password set');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
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
      user.campusCode,
      user.organization,
      user.teacher,
      user.student,
    );
  }
}
