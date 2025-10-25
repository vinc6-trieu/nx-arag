import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { AuthDomainService } from '../../../domain/services/auth.domain.service';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import { UpdateProfileRequestDto, UserDto } from '../../dtos/auth.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(
    userId: string,
    request: UpdateProfileRequestDto,
  ): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Validate role transition if roles are being updated
    if (
      request.roles &&
      !AuthDomainService.validateRoleTransition(user.roles, request.roles)
    ) {
      throw new Error('Invalid role transition');
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, {
      name: request.name,
      phone: request.phone,
      avatar: request.avatar,
      roles: request.roles,
    });

    // Handle student profile updates if needed
    if (
      request.studentCode ||
      request.grade ||
      request.className ||
      request.schoolLevel
    ) {
      // This would be handled by the repository or a separate service
      // For now, we'll assume the repository handles profile updates
    }

    return this.mapToUserDto(updatedUser);
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
