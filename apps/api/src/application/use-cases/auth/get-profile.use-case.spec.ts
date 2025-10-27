import { Cache } from 'cache-manager';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user.repository.impl';
import { GetProfileUseCase } from './get-profile.use-case';

describe('GetProfileUseCase', () => {
  let cacheStore: Record<string, unknown>;
  let cacheManager: Cache;
  let userRepository: jest.Mocked<UserRepositoryImpl>;
  let useCase: GetProfileUseCase;

  beforeEach(() => {
    cacheStore = {};
    const cacheMock: Partial<Cache> = {
      get: jest.fn(async (key: string) => cacheStore[key]),
      set: jest.fn(async (key: string, value: unknown) => {
        cacheStore[key] = value;
      }),
    };
    cacheManager = cacheMock as Cache;

    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryImpl>;

    useCase = new GetProfileUseCase(userRepository, cacheManager);
  });

  it('returns cached profile when available', async () => {
    cacheStore['user:profile:123'] = {
      id: '123',
      email: 'cached@example.com',
      roles: ['student'],
    };

    const profile = await useCase.execute('123');

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(profile.email).toBe('cached@example.com');
  });

  it('fetches from repository and caches the result when not cached', async () => {
    const user = new User(
      '123',
      'user@example.com',
      'User Name',
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ['student'],
      undefined,
      undefined,
      undefined,
      undefined,
      new Date(),
    );
    userRepository.findById.mockResolvedValue(user);

    const profile = await useCase.execute('123');

    expect(userRepository.findById).toHaveBeenCalledWith('123');
    expect((cacheManager.set as jest.Mock).mock.calls[0][0]).toBe(
      'user:profile:123',
    );
    expect(profile.email).toBe('user@example.com');
  });
});
