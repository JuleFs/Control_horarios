import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< Updated upstream
  app.enableCors();
=======
  
  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3001', // URL del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

>>>>>>> Stashed changes
  await app.listen(3000);
}
bootstrap();
