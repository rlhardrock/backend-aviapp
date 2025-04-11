import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { PaginationDto } from '../utils/pagination.dto';


@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}
  
  // Crear un nuevo empresa
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const businessFormat = this.utils.formatNIT(createCompanyDto.business);
      const existingCompany = await this.prisma.company.findFirst({ where: { business: { contains: businessFormat.trim(), mode: 'insensitive' } } });
      if (existingCompany) {
        throw new ConflictException(`El NIT de la compañia ${businessFormat} ya está registrado.`);
      }
      const newCompany = await this.prisma.company.create({
        data: {
          name: this.utils.capitalizeFirstLetter(createCompanyDto.name),
          business: businessFormat,
          phone: this.utils.formatPhoneNumber(createCompanyDto.phone),
          email: createCompanyDto.email.toLowerCase(),
          city: this.utils.capitalizeFirstLetter(createCompanyDto.city),
        },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Empresa creada exitosamente',
        newCompany,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear la compañia.');
    }
  }

  // Listar todos los empresas
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [companies, total] = await Promise.all([
        this.prisma.company.findMany({ take, skip, orderBy: { name: 'asc' } }),
        this.prisma.company.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron empresas');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de Empresas',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        companies,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Buscar un empresa por su ID
  async findOne(id: string) {
    try {
      const business = await this.prisma.company.findUnique({ where: { id } });
      if (!business) {
        throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
      }
      return business;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Buscar una empresa por su nombre
  async findByName(name: string) {
    try {
      const companyName = await this.prisma.company.findFirst({ where: { name: { contains: name.trim(),  mode: 'insensitive' }}});
      if (!companyName) {
        throw new NotFoundException(`Empresa con nombre ${name} no encontrada.`);
      }
      return companyName;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Buscar una empresa por su identificación
  async findByBusiness(business: string) {
    try {
      const normalizedBusiness = this.utils.formatNIT(business);
      const company = await this.prisma.company.findFirst({ where: { business: { contains: normalizedBusiness.trim(),  mode: 'insensitive' }}});
      if (!company) {
        throw new NotFoundException(`Empresa con numero de negocio ${business} no encontrada.`);
      }
      return company;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Actualizar un empresa
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const existingCompany = await this.prisma.company.findUnique({ where: { id } });
      if (!existingCompany) {
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }
        const updatedCompany = await this.prisma.company.update({
          where: { id },
          data: {
            name: this.utils.capitalizeFirstLetter(updateCompanyDto.name),
            business: this.utils.formatNIT(updateCompanyDto.business),
            phone: this.utils.formatPhoneNumber(updateCompanyDto.phone),
            email: updateCompanyDto.email.toLowerCase(),
            city: this.utils.capitalizeFirstLetter(updateCompanyDto.city),
          }
        });
      return { message: 'Empresa actualizada exitosamente', data: updatedCompany };
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

  // Eliminar un empresa
  async remove(id: string) {
    try {
      await this.prisma.company.delete({ where: { id } });
      return { message: `Compañia con ID ${id} eliminada exitosamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`La compania con ID ${id} no fue encontrada.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}