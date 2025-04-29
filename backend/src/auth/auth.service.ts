// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AlumnoService } from '../alumno/alumno.service';
import { MaestroService } from '../maestro/maestro.service';
import { ChecadorService } from '../checador/checador.service';
import { AdminService } from '../admin/admin.service';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private alumnoService: AlumnoService,
    private maestroService: MaestroService,
    private checadorService: ChecadorService,
    private adminService: AdminService,
  ) {}

  async validateUser(email: string, password: string, userType: string): Promise<any> {
    let user;

    switch (userType) {
      case Role.ALUMNO:
        user = await this.alumnoService.findByEmail(email);
        break;
      case Role.MAESTRO:
        user = await this.maestroService.findByEmail(email);
        break;
      case Role.CHECADOR:
        user = await this.checadorService.findByEmail(email);
        break;
      case Role.ADMIN:
        user = await this.adminService.findByEmail(email);
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
    let userId;
    
    // Determine the ID based on user type
    switch (user.userType) {
      case Role.ALUMNO:
        userId = user.ID_Alumno;
        break;
      case Role.MAESTRO:
        userId = user.ID_Maestro;
        break;
      case Role.CHECADOR:
      case Role.ADMIN:
        userId = user.ID;
        break;
    }
    
    // Instead of generating a JWT token, return user info directly
    return {
      user: {
        id: userId,
        nombre: user.Nombre || '', // Adding fallback for checador who doesn't have Nombre
        correo: user.Correo,
        userType: user.userType,
      },
    };
  }
}