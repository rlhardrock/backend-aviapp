import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      const taxpayer = this.utils.formatIdentification(createTransporterDto.taxpayer);
      const existingTransporter = await this.prisma.transporter.findFirst({ where: { taxpayer } });
      if (existingTransporter) {
        throw new ConflictException(`La identificación del transportador ${taxpayer} ya está registrado.`);
      }
      const formattedTransporterData = await this.prisma.transporter.create({
        data: {
          name: this.utils.capitalizeFirstLetter(createTransporterDto.name),
          lastName: this.utils.capitalizeFirstLetter(createTransporterDto.lastName),
          phone: this.utils.formatPhoneNumber(createTransporterDto.phone),
          taxpayer: this.utils.formatIdentification(createTransporterDto.taxpayer),
        },
      });
      const newTransporter = await this.prisma.user.create({
        data: {
          formattedTransporterData
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transportador creado con exito.',
        newTransporter,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el transportador.');
    }
  }

  //  Listar todos los transportadores
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [transporters, total] = await Promise.all([
        this.prisma.transporter.findMany({ take, skip, orderBy: { lastName: 'asc' }}),
        this.prisma.transporter.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron conductores');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de conductores',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        transporters,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }


  //  Buscar un transportador por su id
  async findOne(id: string) {
    try {
      const transporter = await this.prisma.transporter.findUnique({ where: { id } });
      if (!transporter) {
        throw new NotFoundException(`Transportador con ID ${id} no encontrado.`);
      }
      return transporter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
  
  //  Buscar un transportador por su transporter
  async findOneTransporter(taxpayer: string) { 
    try {
      const normalizedTaxpayer = this.utils.formatIdentification(taxpayer);
      const transporter = await this.prisma.transporter.findFirst({ where: { taxpayer: { contains: normalizedTaxpayer.trim(),  mode: 'insensitive' } }});
      if (!transporter) {
        throw new NotFoundException(`Transportador con ID ${taxpayer} no encontrado.`);
      }
      return transporter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  //  Actualizar un transportador
  async update(id: string, updateTransporterDto: UpdateTransporterDto) {
    try {
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
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
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
