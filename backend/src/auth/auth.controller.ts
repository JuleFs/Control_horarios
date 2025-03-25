import { Controller, Post, Body, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto, AuthResponse } from './interfaces/auth.interface';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const user = await this.authService.validateUser(credentials.email, credentials.password);
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      return this.authService.login(user);
    } catch (error) {
      console.error('Error en login:', error);
      throw new UnauthorizedException(error.message || 'Error al iniciar sesión');
    }
  }

  @Public()
  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<AuthResponse> {
    try {
      return await this.authService.createUser(userData);
    } catch (error) {
      console.error('Error en registro:', error);
      throw new UnauthorizedException(error.message || 'Error al registrar usuario');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers() {
    try {
      return await this.authService.findAll();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new UnauthorizedException(error.message || 'Error al obtener usuarios');
    }
  }
} 