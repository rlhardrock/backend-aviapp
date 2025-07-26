import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
     const app = await NestFactory.createApplicationContext(AppModule);
     const usersService = app.get(UsersService);

     const email = 'admi@sena.com';
     const rawPassword = 'sena123456';
     const hashedPassword = await bcrypt.hash(rawPassword, 10);

     const existing = await usersService.findByEmail(email);
     if (existing) {
          console.log('Usuario ya existe');
          await app.close();
          return;
     }

     await usersService.create({
          email,
          password: hashedPassword,
          role: 'ADMINISTRADOR', // o el rol que tengas
          status: 'HABILITADO',
     });

     console.log('Usuario insertado correctamente');
     await app.close();
}

bootstrap();
