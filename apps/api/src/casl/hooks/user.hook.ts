import { Injectable } from '@nestjs/common';
import { GetProfileUseCase } from 'apps/api/src/application/use-cases/auth/get-profile.use-case';

import { UserBeforeFilterHook } from 'nest-casl';

// Local UserDto - should be moved to shared package
export interface UserDto {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  origin?: string;
  campusCode?: string;
  organization?: any;
  teacher?: any;
  student?: any;
}

@Injectable()
export class UserHook implements UserBeforeFilterHook<UserDto> {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  async run(user: UserDto): Promise<UserDto> {
    return {
      ...user,
      ...(await this.getProfileUseCase.execute(user.id)),
    };
  }
}
