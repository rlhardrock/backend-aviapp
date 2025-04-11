import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { PaginationDto } from '../utils/pagination.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
 
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}
  
  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email.toLowerCase();
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException(`El correo ya está registrado.`);
      }

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

      const newUser = await this.prisma.user.create({
        data: {
          sex: this.utils.capitalizeFirstLetter(createUserDto.sex),
          licenseSup: this.utils.formatString(createUserDto.licenseSup),
          name: this.utils.capitalizeFirstLetter(createUserDto.name),
          lastName: this.utils.capitalizeFirstLetter(createUserDto.lastName),
          phone: this.utils.formatPhoneNumber(createUserDto.phone),
          taxpayer: this.utils.formatIdentification(createUserDto.taxpayer),
          email: createUserDto.email.toLowerCase(),
          password: hashedPassword,
          role: this.utils.capitalizeFirstLetter(createUserDto.role),
          status: this.utils.capitalizeFirstLetter(createUserDto.status),
          dateBirth: new Date (createUserDto.dateBirth),
        }
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuario creado con exito.',
        newUser,
      };
    } catch (error) {
        if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el usuario.');
    }
  }

  // Encuentra todos los usuarios
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({ take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.user.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de usuarios',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        users,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra todos los usuarios por rol
  async findAllByRole(paginationDto: PaginationDto, role: string) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const roleFilter: Prisma.StringFilter = { contains: role.trim(), mode: Prisma.QueryMode.insensitive };
      /* const roleFilter = { contains: role.trim(), mode: 'insensitive' }; */
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: { role: roleFilter }, take, skip, orderBy: { lastName: 'asc' } }),
          this.prisma.user.count({ where: { role: roleFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron usuarios con el rol: ${role}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de usuarios con el rol: ${role}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        users,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra todos los usuarios por estado
  async findAllByStatus(paginationDto: PaginationDto, status: string) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const statusFilter: Prisma.StringFilter = { contains: status.trim(), mode: Prisma.QueryMode.insensitive };
      /* const statusFilter = { contains: status.trim(),  mode: 'insensitive' }; */
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({ where: { status: statusFilter }, take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.user.count({ where: { status: statusFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron usuarios con el estado: ${status}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de usuarios con el estado: ${status}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        users,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra un usuario especifico por numero de identificación Real ID
  async findOneTaxpayer(taxpayer: string) {
    try {
      const normalizedTaxpayer = this.utils.formatIdentification(taxpayer);
      const user = await this.prisma.user.findFirst({ where: { taxpayer: { contains: normalizedTaxpayer.trim(),  mode: 'insensitive' } }});
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${taxpayer} no encontrado.`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra un usuario especifico por numero de licencia profesional
  async findOneLicense(licenseSup: string) {
    try {
      const normalizedLicense = this.utils.formatString(licenseSup);
      const user = await this.prisma.user.findFirst({ where: { licenseSup: { contains: normalizedLicense.trim(),  mode: 'insensitive' }}});
      if (!user) {
        throw new NotFoundException(`Usuario con TP ${licenseSup} no encontrado.`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra un usuario especifico por ID
  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Actualizar un usuario existente
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          sex: this.utils.capitalizeFirstLetter(updateUserDto.sex),
          name: this.utils.capitalizeFirstLetter(updateUserDto.name),
          licenseSup: this.utils.formatString(updateUserDto.licenseSup),
          lastName: this.utils.capitalizeFirstLetter(updateUserDto.lastName),
          phone: this.utils.formatPhoneNumber(updateUserDto.phone),
          taxpayer: this.utils.formatIdentification(updateUserDto.taxpayer),
          email: updateUserDto.email ? updateUserDto.email.toLowerCase() : existingUser.email,
          password: updateUserDto.password,
          /* password: updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : undefined, */
          role: this.utils.capitalizeFirstLetter(updateUserDto.role),
          status: this.utils.capitalizeFirstLetter(updateUserDto.status),
          dateBirth: updateUserDto.dateBirth,
        },
      });
      return { message: 'Usuario actualizado satisfactoriamente', data: updatedUser };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Eliminar un usuario existente
  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: `Usuario con ID ${id} eliminado exitosamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}
