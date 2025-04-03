import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ChecadorService } from './checador.service';
import { CreateChecadorDto } from './dto/create-checador.dto';
import { Checador } from '../entities/checador.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('checadores')
export class ChecadorController {
  constructor(private readonly checadorService: ChecadorService) {}

  
  @Post()
  create(@Body() createChecadorDto: CreateChecadorDto): Promise<Checador> {
    return this.checadorService.create(createChecadorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Checador[]> {
    return this.checadorService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Checador> {
    return this.checadorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateChecadorDto: CreateChecadorDto): Promise<Checador> {
    return this.checadorService.update(id, updateChecadorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.checadorService.remove(id);
  }
}
