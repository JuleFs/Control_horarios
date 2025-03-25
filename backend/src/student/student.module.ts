import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
<<<<<<< Updated upstream
import { Student } from './student.entity';
=======
import { Student } from '../entities/student.entity';
import { AuthModule } from '../auth/auth.module';
>>>>>>> Stashed changes

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    AuthModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
