import { Injectable } from '@nestjs/common';
import { GetProfileUseCase } from 'apps/api/src/application/use-cases/auth/get-profile.use-case';
import { UserDto } from '../../application/dtos/auth.dto';

import { UserBeforeFilterHook } from 'nest-casl';

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
