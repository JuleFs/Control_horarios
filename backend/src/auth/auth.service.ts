import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
    phone?: string;
  }) {
    // Verificar si el correo ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear nuevo usuario
    const newUser = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      phone: userData.phone,
    });

    await this.userRepository.save(newUser);

    // Generar token
    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
    
    // Retornar datos del usuario y token
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async updateUser(email: string, userData: Partial<{
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
    phone?: string;
  }>) {
    // Encontrar el usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    // Si se va a actualizar la contraseña, hay que encriptarla
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Actualizar datos del usuario
    Object.assign(user, userData);
    
    // Guardar cambios
    await this.userRepository.save(user);
    
    // Eliminar la contraseña del objeto a retornar
    const { password, ...result } = user;
    
    return result;
  }
  
  async deleteUser(email: string) {
    // Encontrar el usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    // Eliminar el usuario
    await this.userRepository.remove(user);
    
    return { message: `Usuario con email ${email} ha sido eliminado` };
  }
}