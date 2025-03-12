import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api') // Agrega un prefijo a las rutas
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('datos') // Ahora responde en /api/datos
  getHello(): string {
    return this.appService.getHello();
  }
}
