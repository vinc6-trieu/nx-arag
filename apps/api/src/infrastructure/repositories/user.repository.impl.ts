import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  Organization,
  ParentProfile,
  StudentProfile,
  TeacherProfile,
  User,
} from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { googleId },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByAzureAdId(azureAdId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { azureAdId },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async findByStudentCode(studentCode: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { student: { studentCode } },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return user ? this.mapToDomainEntity(user) : null;
  }

  async save(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        passwordUpdated: user.passwordUpdated,
        googleId: user.googleId,
        azureAdId: user.azureAdId,
        phone: user.phone,
        campusCode: user.campusCode,
        avatar: user.avatar,
        roles: user.roles,
        origin: user.origin,
        dateOfBirth: user.dateOfBirth,
        organizationId: user.organizationId,
      },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
    });

    return this.mapToDomainEntity(createdUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        phone: userData.phone,
        avatar: userData.avatar,
        roles: userData.roles,
      },
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
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
    campus?: string,
    grade?: string,
    className?: string,
    roles?: string[],
  ): Promise<User[]> {
    const and: any[] = [];

    if (search) {
      and.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          {
            student: { studentCode: { contains: search, mode: 'insensitive' } },
          },
        ],
      });
    }

    if (campus) {
      and.push({ campusCode: campus });
    }

    if (grade) {
      and.push({ student: { grade } });
    }

    if (className) {
      and.push({ student: { className } });
    }

    if (roles && roles.length > 0) {
      and.push({ roles: { hasSome: roles } });
    }

    const users = await this.prisma.user.findMany({
      where: and.length > 0 ? { AND: and } : undefined,
      include: {
        student: true,
        teacher: true,
        parent: true,
        organization: true,
      },
      skip,
      take,
    });

    return users.map((user) => this.mapToDomainEntity(user));
  }

  async count(
    search?: string,
    campus?: string,
    roles?: string[],
  ): Promise<number> {
    const and: any[] = [];

    if (search) {
      and.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          {
            student: { studentCode: { contains: search, mode: 'insensitive' } },
          },
        ],
      });
    }

    if (campus) {
      and.push({ campusCode: campus });
    }

    if (roles && roles.length > 0) {
      and.push({ roles: { hasSome: roles } });
    }

    return this.prisma.user.count({
      where: and.length > 0 ? { AND: and } : undefined,
    });
  }

  private mapToDomainEntity(user: any): User {
    return new User(
      user.id,
      user.email,
      user.name,
      user.password,
      user.passwordUpdated,
      user.googleId,
      user.azureAdId,
      user.phone,
      user.campusCode,
      user.avatar,
      user.roles,
      user.origin,
      user.dateOfBirth,
      user.organizationId,
      user.createdAt,
      user.student
        ? new StudentProfile(
            user.student.id,
            user.student.userId,
            user.student.studentCode,
            user.student.grade,
            user.student.className,
            user.student.schoolLevel,
            user.student.createdAt,
          )
        : undefined,
      user.teacher
        ? new TeacherProfile(
            user.teacher.id,
            user.teacher.userId,
            user.teacher.homeroomClasses,
            user.teacher.teachingGrades,
            user.teacher.createdAt,
          )
        : undefined,
      user.parent
        ? new ParentProfile(
            user.parent.id,
            user.parent.userId,
            user.parent.createdAt,
          )
        : undefined,
      user.organization
        ? new Organization(
            user.organization.id,
            user.organization.name,
            user.organization.domain,
            user.organization.createdAt,
            user.organization.updatedAt,
          )
        : undefined,
    );
  }
}
