import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    
    if (!user) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciales inválidas',
      };
    }
    
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
    phone?: string;
  }) {
    return this.authService.register(registerData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}