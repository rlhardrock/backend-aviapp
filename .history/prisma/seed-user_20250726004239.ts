import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
     const email = 'admin@sena.com';
     const plainPassword = 'sena123456';
     const hashedPassword = await bcrypt.hash(plainPassword, 10);

     // Evitar duplicados
     const existingUser = await prisma.user.findUnique({
          where: { email },
     });

     if (existingUser) {
          console.log('Usuario ya existe');
          return;
     }

     const user = await prisma.user.create({
          data: {
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
          },
     });

     console.log('Usuario creado:', user);
}

main()
     .catch((e) => {
          console.error('Error creando usuario:', e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });


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