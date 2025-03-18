import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.usersRepository.save({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
      });
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      ...user,
    };
  }

  async createUser(userData: { email: string; password: string; name: string; role?: 'admin' | 'teacher' | 'student'; referenceId?: string }): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    if (!userData.password) {
      throw new UnauthorizedException('La contraseña es requerida');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = await this.usersRepository.save({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'student',
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }
} 