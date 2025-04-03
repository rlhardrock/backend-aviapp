import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
 
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email.toLowerCase() },
      });
      if (existingUser) {
        throw new HttpException('Email ya existe.', HttpStatus.CONFLICT);
      }
      const formattedUserData = {
        sex: this.utils.capitalizeFirstLetter(createUserDto.sex),
        licenseSup: this.utils.formatString(createUserDto.licenseSup),
        name: this.utils.capitalizeFirstLetter(createUserDto.name),
        lastName: this.utils.capitalizeFirstLetter(createUserDto.lastName),
        phone: this.utils.formatPhoneNumber(createUserDto.phone),
        taxpayer: this.utils.formatIdentification(createUserDto.taxpayer),
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password, // Nota: Asegúrate de cifrar la contraseña con bcrypt o similar
        role: this.utils.capitalizeFirstLetter(createUserDto.role),
        status: this.utils.capitalizeFirstLetter(createUserDto.status),
        dateBirth: createUserDto.dateBirth,
      };
      const newUser = await this.prisma.user.create({
        data: formattedUserData,
      });
      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Unexpected error during user creation:', error);
        throw new HttpException(
          'An unexpected error occurred during user creation.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Encuentra todos los usuarios
  async findAll(page: number, limit: number) {
    try {
      if (!page || page <= 0) {
        throw new HttpException('Page must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      if (!limit || limit <= 0) {
        throw new HttpException('Limit must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          take,
          skip,
          orderBy: { lastName: 'asc' },
        }),
        this.prisma.user.count(),
      ]);
      if (total === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        users,
      };
    } catch (error) {
      throw new HttpException(
        error?.response || 'Internal server error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Encuentra todos los usuarios por rol
  async findAllByRole(role: string, page: number, limit: number) {
    try {
      if (!page || page <= 0) {
        throw new HttpException('Page must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      if (!limit || limit <= 0) {
        throw new HttpException('Limit must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      if (!role || typeof role !== 'string') {
        throw new HttpException('Role must be a valid string', HttpStatus.BAD_REQUEST);
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: { role },
          take,
          skip,
          orderBy: { role: 'asc' },
        }),
        this.prisma.user.count({ where: { role } }),
      ]);
      if (total === 0) {
        throw new HttpException('No se encontraron usuarios con el rol: ' + role, HttpStatus.NOT_FOUND);
      }
      return {
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
      } else {
        throw new HttpException(
          'Error al buscar usuarios por rol: ' + error.message || 'Error desconocido',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Encuentra todos los usuarios por estado
  async findAllByStatus(status: string, page: number, limit: number) {
    try {
      if (!page || page <= 0) {
        throw new HttpException('Page must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      if (!limit || limit <= 0) {
        throw new HttpException('Limit must be a positive integer', HttpStatus.BAD_REQUEST);
      }
      if (!status || typeof status !== 'string') {
        throw new HttpException('Status must be a valid string', HttpStatus.BAD_REQUEST);
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({ where: { status }, take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.user.count({ where: { status } }),
      ]);
      if (total === 0) {
        throw new HttpException('No se encontraron usuarios con el estado: ' + status, HttpStatus.NOT_FOUND);
      }
      return {
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
      } else {
        throw new HttpException(
          'Error al buscar usuarios por estado: ' + error.message || 'Error desconocido',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Encuentra un usuario especifico por numero de identificación Real ID
  async findOneTaxpayer(taxpayer: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { taxpayer },
      });
      if (!user) {
        throw new HttpException(
          'Usuario no encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        `Error al buscar usuario por identificación: ${error.message || 'Error desconocido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Encuentra un usuario especifico por numero de licencia profesional
  async findOneLicense(licenseSup: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { licenseSup },
      });
      if (!user) {
        throw new HttpException(
          'Usuario no encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        `Error al buscar usuario por licencia: ${error.message || 'Error desconocido'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Encuentra un usuario especifico por ID
  async findOne(id: string) {
    if (!id || !this.utils.validateUUID(id)) {
      throw new BadRequestException('El ID debe ser un UUID válido.');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'Error de base de datos: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error al buscar usuario por ID: ' + (error.message || 'Error desconocido'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar un usuario existente
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new HttpException('Formato de UUID no válido', HttpStatus.BAD_REQUEST);
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
          email: updateUserDto.email.toLowerCase(),
          password: updateUserDto.password,
          role: this.utils.capitalizeFirstLetter(updateUserDto.role),
          status: this.utils.capitalizeFirstLetter(updateUserDto.status),
          dateBirth: updateUserDto.dateBirth,
        },
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Ha ocurrido un error al actualizar el usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar un usuario existente
  async remove(id: string) {
    if (!this.utils.validateUUID(id)) {
      throw new BadRequestException('Formato de UUID no válido');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      await this.prisma.user.delete({
        where: { id: Number(id) },
      });
      return { message: `Usuario con ID ${id} eliminado exitosamente` };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Ha ocurrido un error al eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
