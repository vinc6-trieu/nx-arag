import { AppError, ErrorKey } from '@lib/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import { userProfileCacheKey } from '../../constants/cache-keys';
import { UserDto } from '../../dtos/auth.dto';

@Injectable()
export class GetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(userId: string): Promise<UserDto> {
    const cacheKey = userProfileCacheKey(userId);
    const cachedProfile = await this.cacheManager.get<UserDto>(cacheKey);

    if (cachedProfile) {
      return this.mapCachedProfile(cachedProfile);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(ErrorKey.AUTH_USER_NOT_FOUND);
    }

    const profile = this.mapToUserDto(user);
    await this.cacheManager.set(cacheKey, profile);

    return profile;
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

  private mapCachedProfile(user: UserDto): UserDto {
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
