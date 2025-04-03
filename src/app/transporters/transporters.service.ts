import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { PaginationDto } from '../utils/pagination.dto';

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
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  //  Listar todos los transportadores
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
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
        statusCode: HttpStatus.OK,
        message: 'Lista de conductores',
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        transporters,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
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
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
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
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  //  Actualizar un transportador
  async update(id: string, updateTransporterDto: UpdateTransporterDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Invalid UUID format'), HttpStatus.BAD_REQUEST;
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
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  //  Eliminar un transportador
  async remove(id: string) {
    try {
      await this.prisma.transporter.delete({ where: { id } });
      return { message: `Conductor con ID ${id} eliminado exitosamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`El transportista con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}
