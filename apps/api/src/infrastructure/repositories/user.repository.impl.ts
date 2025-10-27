import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Organization, User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
        sensitiveInfo: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        sensitiveInfo: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        sensitiveInfo: {
          googleId,
        },
      },
      include: {
        organization: true,
        sensitiveInfo: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByAzureAdId(azureAdId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        sensitiveInfo: {
          azureAdId,
        },
      },
      include: {
        organization: true,
        sensitiveInfo: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async save(user: User): Promise<User> {
    const sensitiveInfoCreate: Record<string, unknown> = {
      passwordUpdated: user.passwordUpdated ?? false,
    };

    if (user.password !== undefined) {
      sensitiveInfoCreate.password = user.password;
    }

    if (user.googleId !== undefined) {
      sensitiveInfoCreate.googleId = user.googleId;
    }

    if (user.azureAdId !== undefined) {
      sensitiveInfoCreate.azureAdId = user.azureAdId;
    }

    if (user.phone !== undefined) {
      sensitiveInfoCreate.phone = user.phone;
    }

    if (user.avatar !== undefined) {
      sensitiveInfoCreate.avatar = user.avatar;
    }

    if (user.origin !== undefined) {
      sensitiveInfoCreate.origin = user.origin;
    }

    if (user.dateOfBirth !== undefined) {
      sensitiveInfoCreate.dateOfBirth = user.dateOfBirth;
    }

    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        roles: user.roles,
        organizationId: user.organizationId,
        sensitiveInfo: {
          create: sensitiveInfoCreate,
        },
      },
      include: {
        organization: true,
        sensitiveInfo: true,
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

    const sensitiveInfoUpdate: Record<string, unknown> = {};

    if (userData.password !== undefined) {
      sensitiveInfoUpdate.password = userData.password;
    }

    if (userData.passwordUpdated !== undefined) {
      sensitiveInfoUpdate.passwordUpdated = userData.passwordUpdated;
    }

    if (userData.googleId !== undefined) {
      sensitiveInfoUpdate.googleId = userData.googleId;
    }

    if (userData.azureAdId !== undefined) {
      sensitiveInfoUpdate.azureAdId = userData.azureAdId;
    }

    if (userData.phone !== undefined) {
      sensitiveInfoUpdate.phone = userData.phone;
    }

    if (userData.avatar !== undefined) {
      sensitiveInfoUpdate.avatar = userData.avatar;
    }

    if (userData.origin !== undefined) {
      sensitiveInfoUpdate.origin = userData.origin;
    }

    if (userData.dateOfBirth !== undefined) {
      sensitiveInfoUpdate.dateOfBirth = userData.dateOfBirth;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userUpdateData,
        ...(Object.keys(sensitiveInfoUpdate).length > 0
          ? {
              sensitiveInfo: {
                upsert: {
                  update: sensitiveInfoUpdate,
                  create: {
                    passwordUpdated:
                      (sensitiveInfoUpdate.passwordUpdated as boolean | undefined) ??
                      false,
                    ...sensitiveInfoUpdate,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        organization: true,
        sensitiveInfo: true,
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
        sensitiveInfo: true,
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

    const sensitiveInfo = user.sensitiveInfo ?? {};

    return new User(
      user.id,
      user.email,
      user.name,
      sensitiveInfo.password,
      sensitiveInfo.passwordUpdated ?? false,
      sensitiveInfo.googleId,
      sensitiveInfo.azureAdId,
      sensitiveInfo.phone,
      sensitiveInfo.avatar,
      user.roles,
      sensitiveInfo.origin,
      sensitiveInfo.dateOfBirth,
      user.organizationId,
      user.createdAt,
      organization,
    );
  }
}
