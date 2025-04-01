import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

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
      if (error.code === 'P2002') {
        throw new BadRequestException('El email ya está registrado.');
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el profesional.');
    }
  }

  // Listar todos los profesionales
  async findAll(page: number, limit: number) {
    try {
      if (!page || page < 1) throw new BadRequestException('El número de página debe ser mayor a 0');
      if (!limit || limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');
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
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
      };
    } catch (error) {
      console.error('Error en findAll:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al obtener la lista de profesionales');
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
        throw new NotFoundException(`Profesional con ID ${id} no encontrado`);
      }
      return professional;
    } catch (error) {
      console.error(`Error en encontrar al profesional con el id(${id}):`, error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al obtener el profesional');
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
      console.error(`Error in ProfessionalsService.findByLicense(${license}):`, error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Ha ocurrido un error inesperado al buscar el profesional.');
    }
  }

  // Encontrar todos los profesionales por rol
  async findByRole(role: string, page: number, limit: number) {
    try {
      if (!role || typeof role !== 'string') {
        throw new BadRequestException('El parámetro "role" es obligatorio y debe ser un string válido.');
      }
      if (!page || page < 1 || !limit || limit < 1) {
        throw new BadRequestException('Los parámetros "page" y "limit" deben ser números enteros mayores a 0.');
      }
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
        throw new HttpException('No hay profesionales encontrados para el rol proporcionado', HttpStatus.NOT_FOUND);
      }
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
      };
    } catch (error) {
      console.error('Error buscando profesional por rol:', error);
      throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Encontrar todos los profesionales por status
  async findByStatus(status: string, page: number, limit: number) {
    try {
      if (!status || typeof status !== 'string') {
        throw new BadRequestException('El parámetro "status" es obligatorio y debe ser un string válido.');
      }
      if (!page || page < 1 || !limit || limit < 1) {
        throw new BadRequestException('Los parámetros "page" y "limit" deben ser números enteros mayores a 0.');
      }
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
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        professionals,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en findByStatus:', error);
      throw new InternalServerErrorException('Ha ocurrido un error mientras se buscaba el profesional');
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
      throw new InternalServerErrorException('Ha ocurrido un error mientras se buscaba el profesional');
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
      if (error.code === 'P2025') {
        throw new NotFoundException(`Profesional con ID ${id} no encontrado`);
      }
      console.error('Update error:', error);
      throw new InternalServerErrorException('Ha ocurrido un error mientras se actualizada el profesional');
    }
  }

  async remove(id: string) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException(`ID inválido: ${id}. Debe ser un UUID válido.`);
      }
      const professional = await this.prisma.professional.findUnique({
        where: { id },
      });
      if (!professional) {
        throw new NotFoundException(`Profesional con ID ${id} no encontrado.`);
      }
      return await this.prisma.professional.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error eliminando profesional con ID ${id}.`);
    }
  }
}
