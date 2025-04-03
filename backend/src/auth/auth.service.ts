import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AlumnoService } from '../alumno/alumno.service';
import { MaestroService } from '../maestro/maestro.service';
import { ChecadorService } from '../checador/checador.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private alumnoService: AlumnoService,
    private maestroService: MaestroService,
    private checadorService: ChecadorService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, userType: string): Promise<any> {
    let user;

    switch (userType) {
      case 'alumno':
        user = await this.alumnoService.findByEmail(email);
        break;
      case 'maestro':
        user = await this.maestroService.findByEmail(email);
        break;
      case 'checador':
        user = await this.checadorService.findByEmail(email);
        break;
      default:
        throw new UnauthorizedException('Tipo de usuario inválido');
    }

    if (user && await bcrypt.compare(password, user.Contraseña)) {
      const { Contraseña, ...result } = user;
      return {
        ...result,
        userType,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.ID_Alumno || user.ID_Maestro || user.ID,
      email: user.Correo,
      userType: user.userType,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.ID_Alumno || user.ID_Maestro || user.ID,
        nombre: user.Nombre,
        correo: user.Correo,
        userType: user.userType,
      },
    };
  }
}
