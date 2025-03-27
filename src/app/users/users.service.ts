import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { async } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        sex: createUserDto.sex,
        name: createUserDto.name,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        taxpayerId: createUserDto.taxpayerId,
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role,
        status: createUserDto.status,
        dateBirth: createUserDto.dateBirth,
      },
    });
  }

  // Encuentra todos los usuarios
  async findAll() {
    return this.prisma.user.findMany();
  }

  // Encuentra un usuario especifico por Identificación Real ID
  async findOne(taxpayerId: string) {
    return this.prisma.user.findUnique({
      where: { taxpayerId },
    });
  }

  // Actualizar un usuario existente
  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        sex: updateUserDto.sex,
        name: updateUserDto.name,
        lastName: updateUserDto.lastName,
        phone: updateUserDto.phone,
        taxpayerId: updateUserDto.taxpayerId,
        email: updateUserDto.email,
        password: updateUserDto.password,
        role: updateUserDto.role,
        status: updateUserDto.status,
        dateBirth: updateUserDto.dateBirth,
      },
    });
  }

  // Eliminar un usuario existente
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
