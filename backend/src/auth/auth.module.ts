// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AlumnoModule } from '../alumno/alumno.module';
import { MaestroModule } from '../maestro/maestro.module';
import { ChecadorModule } from '../checador/checador.module';
import { AdminModule } from '../admin/admin.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    PassportModule,
    AlumnoModule,
    MaestroModule,
    ChecadorModule,
    AdminModule,
  ],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy // Keep this for compatibility but it won't be used much
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}