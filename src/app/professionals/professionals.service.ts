import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
     const normalizedLicense = this.utils.formatString(createProfessionalDto.license);
     const existingProfessional = await this.prisma.professional.findFirst({ where: { license: { contains: normalizedLicense.trim(),  mode: 'insensitive' }} });
     if (existingProfessional) {
       throw new ConflictException(`La matricula profesional ${normalizedLicense} ya está registrada.`);
     }
     const formattedProfessionalData = {
          sex: this.utils.capitalizeFirstLetter(createProfessionalDto.sex),
          license: normalizedLicense,
          name: this.utils.capitalizeFirstLetter(createProfessionalDto.name),
          lastName: this.utils.capitalizeFirstLetter(createProfessionalDto.lastName),
          phone: this.utils.formatPhoneNumber(createProfessionalDto.phone),
          taxpayer: this.utils.formatIdentification(createProfessionalDto.taxpayer),
          email: createProfessionalDto.email.toLowerCase(),
          role: this.utils.capitalizeFirstLetter(createProfessionalDto.role),
          status: this.utils.capitalizeFirstLetter(createProfessionalDto.status),
        };
        const newProfessional = await this.prisma.professional.create({
          data: {
            formattedProfessionalData
          },
        });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Profesional creado con éxito.',
        data: newProfessional,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el usuario.');
    }
  }

  // Listar todos los profesionales
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({ take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.professional.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron profesionales');
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
        professionals,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar un profesional por id
  async findOne(id: string) {
    try {
      const professional = await this.prisma.professional.findUnique({ where: { id } });
      if (!professional) {
        throw new NotFoundException(`Profesional con ID ${id} no encontrado.`);
      }
      return professional;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar un profesional por license
  async findByLicense(license: string) {
    try {
      const normalizedLicense = this.utils.formatString(license);
      const professional = await this.prisma.professional.findFirst({ where: { license: { contains: normalizedLicense.trim(),  mode: 'insensitive' }}});
      if (!professional) {
        throw new NotFoundException(`Profesional con TP ${license} no encontrado.`);
      }
      return professional;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar todos los profesionales por rol
  async findByRole(paginationDto: PaginationDto, role: string) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const roleFilter = { contains: role.trim(), mode: 'insensitive' };
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({
          where: { role: roleFilter }, take, skip, orderBy: { lastName: 'asc' } }),
          this.prisma.professional.count({ where: { role: roleFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron profesionales con el rol: ${role}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de profesionales con el rol: ${role}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar todos los profesionales por status
  async findByStatus(paginationDto: PaginationDto, status: string) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const statusFilter = { contains: status.trim(), mode: 'insensitive' };
      const [professionals, total] = await Promise.all([
        this.prisma.professional.findMany({ where: { status: statusFilter }, take, skip, orderBy: { lastName: 'asc' } }),
        this.prisma.professional.count({ where: { status: statusFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron profesionales con el estado: ${status}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de profesionales con el estado: ${status}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encontrar un profesional por taxpayer
  async findByTaxpayer(taxpayer: string) {
    try {
      const normalizedTaxpayer = this.utils.formatIdentification(taxpayer);
      const profesional = await this.prisma.professional.findFirst({ where: { taxpayer: { contains: normalizedTaxpayer.trim(),  mode: 'insensitive' } }});
      if (!profesional) {
        throw new NotFoundException(`Profesional con ID ${taxpayer} no encontrado.`);
      }
      return profesional;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Actualizar un profesional
  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    try {
      const existingProfessional = await this.prisma.professional.findUnique({ where: { id } });
      if (!existingProfessional) {
        throw new HttpException('Profesional no encontrado', HttpStatus.NOT_FOUND);
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
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Profesional con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
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
