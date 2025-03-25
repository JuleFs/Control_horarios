import { Injectable, OnModuleInit, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { CreateUserDto, AuthResponse } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private jwtService: JwtService,
    private dataSource: DataSource,
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

  async login(user: Omit<User, 'password'>): Promise<AuthResponse> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async createUser(userData: CreateUserDto): Promise<AuthResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si el usuario ya existe
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('El usuario ya existe');
      }

      if (!userData.password) {
        throw new UnauthorizedException('La contraseña es requerida');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Crear el usuario
      const newUser = await queryRunner.manager.save(User, {
        ...userData,
        password: hashedPassword,
        role: userData.role || 'student',
      });

      // Crear estudiante o profesor según el rol
      if (userData.role === 'student') {
        await queryRunner.manager.save(Student, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        });
      } else if (userData.role === 'teacher') {
        await queryRunner.manager.save(Teacher, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        });
      }

      await queryRunner.commitTransaction();

      // Generar y devolver el token JWT junto con la información del usuario
      const { password, ...userWithoutPassword } = newUser;
      const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
      
      return {
        token: this.jwtService.sign(payload),
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async updateUser(email: string, userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    // Si se está actualizando el email, verificar que no exista otro usuario con ese email
    if (userData.email && userData.email !== email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new UnauthorizedException('El email ya está en uso');
      }
    }

    // Si se proporciona una nueva contraseña, hashearla
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.usersRepository.update({ email }, userData);
    const updatedUser = await this.usersRepository.findOne({ where: { email: userData.email || email } });
    
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo encontrar el usuario actualizado`);
    }

    const { password, ...result } = updatedUser;
    return result;
  }

  async deleteUser(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    await this.usersRepository.delete({ email });
  }
} 