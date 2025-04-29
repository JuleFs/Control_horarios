// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(req.user);
  }
  
  // Simple login endpoint without guard
  @Public()
  @Post('login-simple')
  async loginSimple(@Body() authLoginDto: AuthLoginDto) {
    const user = await this.authService.validateUser(
      authLoginDto.correo,
      authLoginDto.contraseña,
      authLoginDto.userType
    );
    
    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }
    
    const result = await this.authService.login(user);
    return { success: true, ...result };
  }
}