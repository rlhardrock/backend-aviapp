import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        sex: this.utilsService.capitalizeFirstLetter(createUserDto.sex),
        name: this.utilsService.capitalizeFirstLetter(createUserDto.name),
        lastName: this.utilsService.capitalizeFirstLetter(createUserDto.lastName),
        phone: this.utilsService.formatPhoneNumber(createUserDto.phone),
        taxpayerId: this.utilsService.formatIdentification(createUserDto.taxpayerId),
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password,
        role: this.utilsService.capitalizeFirstLetter(createUserDto.role),
        status: this.utilsService.capitalizeFirstLetter(createUserDto.status),
        dateBirth: createUserDto.dateBirth,
      },
    });
  }

  // Encuentra todos los usuarios
  async findAll() {
    return this.prisma.user.findMany();
  }

  // Encuentra todos los usuarios por rol
  async findAllByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role },
    });
  }

  // Encuentra todos los usuarios por estado
  async findAllByStatus(status: string) {
    return this.prisma.user.findMany({
      where: { status },
    });
  }

  // Encuentra un usuario especifico por numero de identificación Real ID
  async findOneTaxpayerId(taxpayerId: string) {
    return this.prisma.user.findUnique({
      where: { taxpayerId },
    });
  }

  // Encuentra un usuario especifico por ID
  async findOneId(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Actualizar un usuario existente
  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        sex: this.utilsService.capitalizeFirstLetter(updateUserDto.sex),
        name: this.utilsService.capitalizeFirstLetter(updateUserDto.name),
        lastName: this.utilsService.capitalizeFirstLetter(updateUserDto.lastName),
        phone: this.utilsService.formatPhoneNumber(updateUserDto.phone),
        taxpayerId: this.utilsService.formatIdentification(updateUserDto.taxpayerId),
        email: updateUserDto.email.toLowerCase(),
        password: updateUserDto.password,
        role: this.utilsService.capitalizeFirstLetter(updateUserDto.role),
        status: this.utilsService.capitalizeFirstLetter(updateUserDto.status),
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
