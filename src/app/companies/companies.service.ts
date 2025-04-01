import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';


@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  // Crear un nuevo empresa
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.prisma.company.create({
        data: {
          name: this.utils.capitalizeFirstLetter(createCompanyDto.name),
          business: this.utils.formatIdentification(createCompanyDto.business),
          phone: this.utils.formatPhoneNumber(createCompanyDto.phone),
          email: createCompanyDto.email.toLowerCase(),
          city: this.utils.capitalizeFirstLetter(createCompanyDto.city),
        },
      });
      return {
        message: 'Empresa creada exitosamente',
        company,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error al crear la empresa.');
    }
  }

  // Listar todos los empresas
  async findAll(page: number, limit: number) {
    try {
      if (!page || page < 1) throw new BadRequestException('La página debe ser un número entero positivo.');
      if (!limit || limit < 1) throw new BadRequestException('El limite debe ser un número entero positivo.');
      const { take, skip } = this.utils.paginateList(page, limit);
      const [companies, total] = await Promise.all([
        this.prisma.company.findMany({ take, skip, orderBy: { id: 'asc' } }),
        this.prisma.company.count(),
      ]);
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,  
        hasPrevPage: page > 1,
        companies,
      };
    } catch (error) {
      console.error('Error en listar todas las empresas:', error);
      throw new HttpException('Ha ocurrido un error al listar todas las empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Buscar un empresa por su ID
  async findOne(id: string) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Invalid UUID format');
      }
      const company = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return company;
    } catch (error) {
      throw error;
    }
  }

  // Buscar una empresa por su nombre
  async findByName(name: string) {
    try {
      if (!name || name.trim().length < 3) {
        throw new HttpException(
          'El nombre debe tener al menos 3 caracteres',
          HttpStatus.BAD_REQUEST,
        );
      }
        const company = await this.prisma.company.findMany({
        where: {
          name: {
            contains: name.trim(),
            mode: 'insensitive',
          },
        },
      });
      if (!company.length) {
        throw new HttpException(
          `No se encontró ninguna empresa con el nombre "${name}"`,
          HttpStatus.NOT_FOUND,
        );
      }
      return company;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno en el servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar una empresa por su identificación
  async findByBusiness(business: string) {
    try {
      if (!business || business.trim() === '') {
        throw new BadRequestException('El business es obligatorio.');
      }
      const company = await this.prisma.company.findFirst({
        where: {
          business: {
            contains: business,
            mode: 'insensitive',
          },
        },
      });
      if (!company) {
        throw new NotFoundException(`No se encontró ninguna empresa con numero de negocio: "${business}".`);
      }
      return company;
    } catch (error) {
      console.error('Error en findByBusiness:', error);
      throw new InternalServerErrorException('Ha ocurrido un error mientras se buscaba la empresa.');
    }
  } 

  // Actualizar un empresa
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      if (!this.utils.validateUUID(id)) {
        throw new BadRequestException('Invalid UUID format');
      }
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!existingCompany) {
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }
      const updatedData = {
        name: this.utils.capitalizeFirstLetter(updateCompanyDto.name),
        business: this.utils.formatIdentification(updateCompanyDto.business),
        phone: this.utils.formatPhoneNumber(updateCompanyDto.phone),
        email: updateCompanyDto.email.toLowerCase(),
        city: this.utils.capitalizeFirstLetter(updateCompanyDto.city),
      };
      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: updatedData,
      });
      return {
        message: 'Empresa actualizada exitosamente',
        data: updatedCompany,
      };
    } catch (error) {
      console.error('Error actualizando empresa:', error);
      if (error.code === 'P2025') {
        throw new HttpException(
          'No se encontró la empresa para actualizar',
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Eliminar un empresa
  async remove(id: string) {
    if (!this.utils.validateUUID(id)) {
      throw new BadRequestException('Formato UUID invalido');
    }
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!existingCompany) {
        throw new NotFoundException(`Compañia con el ID ${id} no fue encontrada.`);
      }
      return await this.prisma.company.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Compañia con el ID ${id} no fue encontrada.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error al eliminar la empresa.');
    }
  }
}
