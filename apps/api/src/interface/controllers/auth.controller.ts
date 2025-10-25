import { AzureAdAuthGuard, JwtGuard, RequestAuth } from '@lib/utils';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  GoogleLoginDto,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileRequestDto,
} from '../../application/dtos/auth.dto';
import { GetProfileUseCase } from '../../application/use-cases/auth/get-profile.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/update-profile.use-case';
import { UserRoles } from '../../domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto) {
    return this.registerUseCase.execute(body);
  }

  @Post('login/aad')
  @UseGuards(AzureAdAuthGuard)
  async azureAAD(@Req() req: any) {
    const profile = req.user;
    // This would use a separate use case for Azure AD login
    // For now, we'll return the profile
    return { message: 'Azure AD login successful', profile };
  }

  @Post('google')
  async googleLogin(@Body() body: GoogleLoginDto) {
    // This would use a separate use case for Google login
    // For now, we'll return a mock response
    return { message: 'Google login successful', idToken: body.idToken };
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@RequestAuth() auth: RequestAuth) {
    return this.getProfileUseCase.execute(auth.user.id);
  }

  @Put('profile')
  @UseGuards(JwtGuard)
  async updateProfile(
    @RequestAuth() auth: RequestAuth,
    @Body() body: UpdateProfileRequestDto,
  ) {
    return this.updateProfileUseCase.execute(auth.user.id, body);
  }

  @Post('password/change')
  @UseGuards(JwtGuard)
  async changePassword() {
    // @Body() __: ChangePasswordRequestDto, // @RequestAuth() _: RequestAuth,
    // This would use a separate use case for password change
    return { message: 'Password change successful' };
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  async logout() { // @RequestAuth() _: RequestAuth
    // This would use a separate use case for logout
    return { message: 'Logout successful' };
  }

  @Get('roles')
  async getRoles() {
    return Object.values(UserRoles);
  }
}
