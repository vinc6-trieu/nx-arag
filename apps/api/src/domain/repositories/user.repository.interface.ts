import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByAzureAdId(azureAdId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  list(
    skip: number,
    take: number,
    search?: string,
    roles?: string[],
  ): Promise<User[]>;
  count(search?: string, roles?: string[]): Promise<number>;
}
