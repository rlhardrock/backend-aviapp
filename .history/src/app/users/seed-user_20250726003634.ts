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
         ,
          "sex": "Hombre",
          "licenseSup": "TURBO",
          "name": "Michael",
          "lastName": "Knight",
          "phone": "3003442255",
          "taxpayer": "5262428272",
          "email": "admin@aves.com",
          "password": "123456",
          "role": "ADMINISTRADOR",
          "status": "HABILITADO",
          "dateBirth": "1990-01-15"
     });

     console.log('Usuario insertado correctamente');
     await app.close();
}

bootstrap();
