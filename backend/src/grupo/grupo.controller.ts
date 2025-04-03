import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { Grupo } from '../entities/grupo.entity';

@Controller('grupos')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    return this.grupoService.create(createGrupoDto);
  }

  @Get()
  findAll(): Promise<Grupo[]> {
    return this.grupoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Grupo> {
    return this.grupoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGrupoDto: CreateGrupoDto): Promise<Grupo> {
    return this.grupoService.update(id, updateGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.grupoService.remove(id);
  }
}