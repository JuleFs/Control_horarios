import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AlumnoModule } from '../alumno/alumno.module';
import { MaestroModule } from '../maestro/maestro.module';
import { ChecadorModule } from '../checador/checador.module';
import { AdminModule } from '../admin/admin.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    // Usar un valor directo en lugar de cargar desde ConfigService
    JwtModule.register({
      secret: 'tu_clave_secreta_jwt',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    AlumnoModule,
    MaestroModule,
    ChecadorModule,
    AdminModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}