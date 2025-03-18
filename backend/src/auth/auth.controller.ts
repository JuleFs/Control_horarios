import { Controller, Post, Body, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../entities/user.entity';
import { Public } from './public.decorator';

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'teacher' | 'student';
  referenceId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(credentials.email, credentials.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(@Body() userData: CreateUserDto) {
    try {
      const newUser = await this.authService.createUser(userData);
      return newUser;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    try {
      const users = await this.authService.findAll();
      return users;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
} 