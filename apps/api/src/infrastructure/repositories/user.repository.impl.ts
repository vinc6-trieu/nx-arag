import { Injectable } from '@nestjs/common';
import { Organization, User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
        credential: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        credential: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        credential: {
          googleId,
        },
      },
      include: {
        organization: true,
        credential: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByAzureAdId(azureAdId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        credential: {
          azureAdId,
        },
      },
      include: {
        organization: true,
        credential: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async save(user: User): Promise<User> {
    const credentialCreate: Record<string, unknown> = {
      passwordUpdated: user.passwordUpdated ?? false,
    };

    if (user.password !== undefined) {
      credentialCreate.password = user.password;
    }

    if (user.googleId !== undefined) {
      credentialCreate.googleId = user.googleId;
    }

    if (user.azureAdId !== undefined) {
      credentialCreate.azureAdId = user.azureAdId;
    }

    if (user.phone !== undefined) {
      credentialCreate.phone = user.phone;
    }

    if (user.avatar !== undefined) {
      credentialCreate.avatar = user.avatar;
    }

    if (user.origin !== undefined) {
      credentialCreate.origin = user.origin;
    }

    if (user.dateOfBirth !== undefined) {
      credentialCreate.dateOfBirth = user.dateOfBirth;
    }

    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        roles: user.roles,
        organizationId: user.organizationId,
        credential: {
          create: credentialCreate,
        },
      },
      include: {
        organization: true,
        credential: true,
      },
    });

    return this.mapToDomainEntity(createdUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userUpdateData: Record<string, unknown> = {};

    if (userData.name !== undefined) {
      userUpdateData.name = userData.name;
    }

    if (userData.roles !== undefined) {
      userUpdateData.roles = userData.roles;
    }

    if (userData.organizationId !== undefined) {
      userUpdateData.organizationId = userData.organizationId;
    }

    const credentialUpdate: Record<string, unknown> = {};

    if (userData.password !== undefined) {
      credentialUpdate.password = userData.password;
    }

    if (userData.passwordUpdated !== undefined) {
      credentialUpdate.passwordUpdated = userData.passwordUpdated;
    }

    if (userData.googleId !== undefined) {
      credentialUpdate.googleId = userData.googleId;
    }

    if (userData.azureAdId !== undefined) {
      credentialUpdate.azureAdId = userData.azureAdId;
    }

    if (userData.phone !== undefined) {
      credentialUpdate.phone = userData.phone;
    }

    if (userData.avatar !== undefined) {
      credentialUpdate.avatar = userData.avatar;
    }

    if (userData.origin !== undefined) {
      credentialUpdate.origin = userData.origin;
    }

    if (userData.dateOfBirth !== undefined) {
      credentialUpdate.dateOfBirth = userData.dateOfBirth;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userUpdateData,
        ...(Object.keys(credentialUpdate).length > 0
          ? {
              credential: {
                upsert: {
                  update: credentialUpdate,
                  create: {
                    passwordUpdated:
                      (credentialUpdate.passwordUpdated as
                        | boolean
                        | undefined) ?? false,
                    ...credentialUpdate,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        organization: true,
        credential: true,
      },
    });

    return this.mapToDomainEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async list(
    skip: number,
    take: number,
    search?: string,
    roles?: string[],
  ): Promise<User[]> {
    const and: any[] = [];

    if (search) {
      and.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (roles && roles.length > 0) {
      and.push({ roles: { hasSome: roles } });
    }

    const users = await this.prisma.user.findMany({
      where: and.length > 0 ? { AND: and } : undefined,
      include: {
        organization: true,
        credential: true,
      },
      skip,
      take,
    });

    return users.map((user) => this.mapToDomainEntity(user));
  }

  async count(search?: string, roles?: string[]): Promise<number> {
    const and: any[] = [];

    if (search) {
      and.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (roles && roles.length > 0) {
      and.push({ roles: { hasSome: roles } });
    }

    return this.prisma.user.count({
      where: and.length > 0 ? { AND: and } : undefined,
    });
  }

  private mapToDomainEntity(user: any): User {
    const organization = user.organization
      ? new Organization(
          user.organization.id,
          user.organization.name,
          user.organization.domain,
          user.organization.createdAt,
          user.organization.updatedAt,
        )
      : undefined;

    const credential = user.credential ?? {};

    return new User(
      user.id,
      user.email,
      user.name,
      credential.password,
      credential.passwordUpdated ?? false,
      credential.googleId,
      credential.azureAdId,
      credential.phone,
      credential.avatar,
      user.roles,
      credential.origin,
      credential.dateOfBirth,
      user.organizationId,
      user.createdAt,
      organization,
    );
  }
}
