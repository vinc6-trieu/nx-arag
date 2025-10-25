import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import { UserDto } from '../../dtos/auth.dto';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return this.mapToUserDto(user);
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
