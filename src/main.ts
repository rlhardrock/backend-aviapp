import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* const config = new DocumentBuilder()
    .setTitle('API de Beneficio de Aves')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0') */
    /*.addBearerAuth()*/ // Para autenticación con JWT
    /* .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); */

  app.setGlobalPrefix('avi'); // Prefijo global para las rutas

  app.use(helmet()); // Seguridad con Helmet

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades desconocidas
      transform: false, // Convierte automáticamente los tipos de datos (ej: string a number)
    })
  );

  // Habilitar CORS para que el frontend pueda comunicarse con el backend
  app.enableCors({
    //origin: 'https://avicola.netlify.app', // Permite solo tu frontend
    origin:'http://localhost:4200',
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false
  });

  const port = process.env.PORT ?? 3000; // Definir el puerto, usando 3000 por defecto
  await app.listen(port);
  console.warn(`Server running on http://localhost:${port}`);

}

bootstrap();
