import { AppError, ErrorKey } from '@lib/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { User } from '../../../domain/entities/user.entity';
import { AuthDomainService } from '../../../domain/services/auth.domain.service';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import { userProfileCacheKey } from '../../constants/cache-keys';
import { UpdateProfileRequestDto, UserDto } from '../../dtos/auth.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(
    userId: string,
    request: UpdateProfileRequestDto,
  ): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(ErrorKey.AUTH_USER_NOT_FOUND);
    }

    // Validate role transition if roles are being updated
    if (
      request.roles &&
      !AuthDomainService.validateRoleTransition(user.roles, request.roles)
    ) {
      throw new AppError(ErrorKey.AUTH_INVALID_ROLE_TRANSITION);
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, {
      name: request.name,
      phone: request.phone,
      avatar: request.avatar,
      roles: request.roles,
    });

    const updatedProfile = this.mapToUserDto(updatedUser);

    await this.cacheManager.del(userProfileCacheKey(userId));
    await this.cacheManager.set(userProfileCacheKey(userId), updatedProfile);

    return updatedProfile;
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
