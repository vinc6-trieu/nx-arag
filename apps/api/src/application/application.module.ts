import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';
import { PrismaService } from '../prisma/prisma.service';
import { GetProfileUseCase } from './use-cases/auth/get-profile.use-case';
import { LoginUseCase } from './use-cases/auth/login.use-case';
import { RegisterUseCase } from './use-cases/auth/register.use-case';
import { UpdateProfileUseCase } from './use-cases/auth/update-profile.use-case';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,

    // Repositories
    UserRepositoryImpl,

    // Infrastructure Services
    PrismaService,
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
  ],
})
export class ApplicationModule {}
