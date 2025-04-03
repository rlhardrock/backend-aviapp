import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { PaginationDto } from '../utils/pagination.dto';

@Injectable()
export class ProfessionalsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) {}
  
  // Crear un profesional
  async create(createProfessionalDto: CreateProfessionalDto) {
    try {
      if (!createProfessionalDto.email) {
        throw new BadRequestException('El email es obligatorio.');
      }
      const professional = await this.prisma.professional.create({
        data: {
          sex: this.utils.capitalizeFirstLetter(createProfessionalDto.sex),
          license: createProfessionalDto.license,
          name: this.utils.capitalizeFirstLetter(createProfessionalDto.name),
          lastName: this.utils.capitalizeFirstLetter(createProfessionalDto.lastName),
          phone: this.utils.formatPhoneNumber(createProfessionalDto.phone),
          taxpayer: this.utils.formatIdentification(createProfessionalDto.taxpayer),
          email: createProfessionalDto.email.toLowerCase(),
          role: this.utils.capitalizeFirstLetter(createProfessionalDto.role),
          status: this.utils.capitalizeFirstLetter(createProfessionalDto.status),
        },
      });
      return {
        message: 'Profesional creado con éxito.',
        data: professional,
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

  // Listar todos los profesionales
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.professional.count(),
      ]);
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de profesionales',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
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

  // Encontrar un profesional por id
  async findOne(id: string) {
    if (!id || !this.utils.validateUUID(id)) {
      throw new BadRequestException('El ID debe ser un UUID válido.');
    }
    try {
      const professional = await this.prisma.professional.findUnique({
        where: { id },
      });
      if (!professional) {
        throw new NotFoundException(`Profesional no encontrado`);
      }
      return professional;
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encontrar un profesional por license
  async findByLicense(license: string) {
    try {
      const professional = await this.prisma.professional.findUnique({
        where: { license },
      });
      if (!professional) {
        throw new NotFoundException(`Profesional con license '${license}' no encontrado.`);
      }
      return professional;
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encontrar todos los profesionales por rol
  async findByRole(role: string, paginationDto: PaginationDto) {
    try {
      const { page, limit} = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({
          where: { role },
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.professional.count({ where: { role } }),
      ]);
      if (total === 0) {
        throw new HttpException(`No se encontraron profesionales con el rol "${role}".`, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de profesionales con el rol ${role}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
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

  // Encontrar todos los profesionales por status
  async findByStatus(status: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({
          where: { status },
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.professional.count({ where: { status } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron profesionales con el estado "${status}".`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de profesionales con el estado ${status}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
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

  // Encontrar un profesional por taxpayer
  async findByTaxpayer(taxpayer: string) {
    try {
      const transporter = await this.prisma.professional.findUnique({
        where: { taxpayer },
      });
      if (!transporter) {
        throw new NotFoundException(`Profesional con taxpayer ${taxpayer} no encontrado`);
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

  // Actualizar un profesional
  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Formato UUID invalido');
       }
      const existingProfessional = await this.prisma.professional.findUnique({
        where: { id },
      });
      if (!existingProfessional) {
        throw new NotFoundException(`Profesional con ID ${id} no encontrado`);
      }
      const updatedProfessional = await this.prisma.professional.update({
        where: { id },
        data: {
          sex: this.utils.capitalizeFirstLetter(updateProfessionalDto.sex),
          license: this.utils.capitalizeFirstLetter(updateProfessionalDto.license),
          name: this.utils.capitalizeFirstLetter(updateProfessionalDto.name),
          lastName: this.utils.capitalizeFirstLetter(updateProfessionalDto.lastName),
          phone: this.utils.formatPhoneNumber(updateProfessionalDto.phone),
          taxpayer: this.utils.formatIdentification(updateProfessionalDto.taxpayer),
          email: updateProfessionalDto.email.toLowerCase(),
          role: this.utils.capitalizeFirstLetter(updateProfessionalDto.role),
          status: this.utils.capitalizeFirstLetter(updateProfessionalDto.status),
        },
      });
      return {
        message: 'Profesional actualizado satisfactoriamente',
        data: updatedProfessional,
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

  async remove(id: string) {
    try {
      await this.prisma.professional.delete({ where: { id } });
      return { message: `Profesional con ID ${id} eliminado exitosamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`El profesional con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}
