import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class TransportersService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  //  Crear un nuevo transportador
  async create(createTransporterDto: CreateTransporterDto) {
    try {
      if (typeof createTransporterDto.name !== 'string' || typeof createTransporterDto.lastName !== 'string') {
        throw new HttpException('Nombre y Apellido deben ser strings validos', HttpStatus.BAD_REQUEST);
      }
      if (!this.utils.formatPhoneNumber(createTransporterDto.phone)) {
        throw new HttpException('Formato de número de teléfono invalido', HttpStatus.BAD_REQUEST);
      }
      if (!this.utils.formatIdentification(createTransporterDto.taxpayer)) {
        throw new HttpException('Formato de identificación invalido', HttpStatus.BAD_REQUEST);
      }
      const transporter = await this.prisma.transporter.create({
        data: {
          name: this.utils.capitalizeFirstLetter(createTransporterDto.name),
          lastName: this.utils.capitalizeFirstLetter(createTransporterDto.lastName),
          phone: this.utils.formatPhoneNumber(createTransporterDto.phone),
          taxpayer: this.utils.formatIdentification(createTransporterDto.taxpayer),
        },
      });
      return transporter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error inesperado durante la creación del transportador:', error);
        throw new HttpException(
          'Ocurrió un error inesperado al crear el transportador.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //  Listar todos los transportadores
  async findAll(page: number, limit: number) {
    try {
      if (!page || page < 1) throw new BadRequestException('La página debe ser un número entero positivo.');
      if (!limit || limit < 1) throw new BadRequestException('El limite debe ser un número entero positivo.');
      const { take, skip } = this.utils.paginateList(page, limit);
      const [transporters, total] = await Promise.all([
        this.prisma.transporter.findMany({
          take,
          skip,
          orderBy: { lastName: 'asc' },
        }),
        this.prisma.transporter.count(),
      ]);
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page * limit < total;
      const hasPrevPage = page > 1;
      return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        transporters,
      };
    } catch (error) {
       throw new HttpException(
        error.response || 'Error inesperado en el servidor.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Buscar un transportador por su id
  async findOne(id: string) {
    if (!id) {
      throw new HttpException(
        'El ID es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.utils.validateUUID(id)) {
      throw new HttpException(
        'El ID proporcionado no es válido',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const transporter = await this.prisma.transporter.findUnique({
        where: { id },
      });
      if (!transporter) {
        throw new HttpException(
          `Transportista con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return transporter;
    } catch (error) {
      console.error('Error al buscar el transporter:', error);
      throw new HttpException(
        'Error interno del servidor, intente nuevamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  //  Buscar un transportador por su transporter
  async findOneTransporter(taxpayer: string) { 
    try {
      if (!taxpayer || taxpayer.trim() === '') {
        throw new HttpException('El ID del transportista es requerido', HttpStatus.BAD_REQUEST);
      }
      const transporterRecord = await this.prisma.transporter.findUnique({
        where: { taxpayer }
      });
      if (!transporterRecord) {
        throw new HttpException('Transportista no encontrado', HttpStatus.NOT_FOUND);
      }
      return transporterRecord;
    } catch (error) {
      throw new HttpException(
        error?.response || 'Error interno del servidor',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //  Actualizar un transportador
  async update(id: string, updateTransporterDto: UpdateTransporterDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Invalid UUID format');
      }
      if (updateTransporterDto.name && updateTransporterDto.name.length > 50) {
        throw new HttpException('Nombre es demasiado largo. Tamaño maximo de 50 caracteres.', HttpStatus.BAD_REQUEST);
      }
      if (updateTransporterDto.lastName && updateTransporterDto.lastName.length > 50) {
        throw new HttpException('Apellido es demasiado largo. Tamaño maximo de 50 caracteres.', HttpStatus.BAD_REQUEST);
      }
      const transporterExists = await this.prisma.transporter.findUnique({ where: { id } });
      if (!transporterExists) {
        throw new HttpException('Transportista no encontrado', HttpStatus.NOT_FOUND);
      }
      const updatedTransporter = await this.prisma.transporter.update({
        where: { id },
        data: {
          name: this.utils.capitalizeFirstLetter(updateTransporterDto.name),
          lastName: this.utils.capitalizeFirstLetter(updateTransporterDto.lastName),
          phone: this.utils.formatPhoneNumber(updateTransporterDto.phone),
          taxpayer: this.utils.formatIdentification(updateTransporterDto.taxpayer),
        },
      });
      return updatedTransporter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ocurrió un error inesperado al actualizar el transportista',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //  Eliminar un transportador
  async remove(id: string) {
    if (!this.utils.validateUUID(id)) {
      throw new HttpException('El ID proporcionado no es válido.', HttpStatus.BAD_REQUEST);
    }
    try {
      const transporter = await this.prisma.transporter.delete({
        where: { id },
      });
      if (!transporter) {
        throw new HttpException(
          `Transporter con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Transporter eliminado exitosamente' };
    } catch (error) {
      throw new HttpException(
        'Error al eliminar el transporter, por favor intente de nuevo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
