import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class UsersService {
 
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        sex: this.utils.capitalizeFirstLetter(createUserDto.sex),
        name: this.utils.capitalizeFirstLetter(createUserDto.name),
        lastName: this.utils.capitalizeFirstLetter(createUserDto.lastName),
        phone: this.utils.formatPhoneNumber(createUserDto.phone),
        taxpayerId: this.utils.formatIdentification(createUserDto.taxpayerId),
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password,
        role: this.utils.capitalizeFirstLetter(createUserDto.role),
        status: this.utils.capitalizeFirstLetter(createUserDto.status),
        dateBirth: createUserDto.dateBirth,
      },
    });
  }

  // Encuentra todos los usuarios
  async findAll(page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count()
    ])
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      users,
    };
  }

  // Encuentra todos los usuarios por rol
  async findAllByRole(role: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where: { role }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where: { role } }),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      users,
    };
  }

  // Encuentra todos los usuarios por estado
  async findAllByStatus(status: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where: { status }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where: { status } }),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      users,
    };
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
        sex: this.utils.capitalizeFirstLetter(updateUserDto.sex),
        name: this.utils.capitalizeFirstLetter(updateUserDto.name),
        lastName: this.utils.capitalizeFirstLetter(updateUserDto.lastName),
        phone: this.utils.formatPhoneNumber(updateUserDto.phone),
        taxpayerId: this.utils.formatIdentification(updateUserDto.taxpayerId),
        email: updateUserDto.email.toLowerCase(),
        password: updateUserDto.password,
        role: this.utils.capitalizeFirstLetter(updateUserDto.role),
        status: this.utils.capitalizeFirstLetter(updateUserDto.status),
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
