import { NestFactory } from '@nestjs/core';
import { UsersService } from '../src/app/users/users.service';
import * as bcrypt from 'bcrypt';

import { AppModule } from '../src/app/app.module';


async function bootstrap() {
     const app = await NestFactory.createApplicationContext(AppModule);
     const usersService = app.get(UsersService);

     const email = 'admin@sena.com';
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
          sex: "Hombre",
          licenseSup: "TURBO",
          name: "Michael",
          lastName: "Knight",
          phone: "3003442255",
          taxpayer: "5262428272",
          role: "ADMINISTRADOR",
          status: "HABILITADO",
          dateBirth: "1990-01-15"
     });

     console.log('Usuario insertado correctamente');
     await app.close();
}

bootstrap();

/* 

await usersService.create({
     email,
     password: hashedPassword,
     sex: "Hombre",
     licenseSup: "TURBO",
     name: "Michael",
     lastName: "Knight",
     phone: "3003442255",
     taxpayer: "5262428272",
     role: "ADMINISTRADOR",
     status: "HABILITADO",
     dateBirth: "1990-01-15"
});
 */