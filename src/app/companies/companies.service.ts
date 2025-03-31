import { Injectable } from '@nestjs/common';
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
  create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: this.utils.capitalizeFirstLetter(createCompanyDto.name),
        businessId: this.utils.formatIdentification(createCompanyDto.businessId),
        phone: this.utils.formatPhoneNumber(createCompanyDto.phone),
        email: createCompanyDto.email.toLowerCase(),
        city: this.utils.capitalizeFirstLetter(createCompanyDto.city),
      },
    });
  }

  // Listar todos los empresas
  async findAll(page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({ take, skip }),
      this.prisma.company.count()
    ])
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      companies
    };
  }

  // Buscar un empresa por su ID
  findOne(id: number) {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }

  // Buscar una empresa por su nombre
  findByName(name: string) {
    return this.prisma.company.findUnique({
      where: {
        name,
      },
    });
  }

  // Buscar una empresa por su identificación
  findByBusinessId(businessId: string) {
    return this.prisma.company.findUnique({
      where: {
        businessId,
      },
    });
  }

  // Actualizar un empresa
  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return  this.prisma.company.update({
      where: {
        id,
      },
      data: {
        name: this.utils.capitalizeFirstLetter(updateCompanyDto.name),
        businessId: this.utils.formatIdentification(updateCompanyDto.businessId),
        phone: this.utils.formatPhoneNumber(updateCompanyDto.phone),
        email: updateCompanyDto.email.toLowerCase(),
        city: this.utils.capitalizeFirstLetter(updateCompanyDto.city),
      },
    });
  }

  remove(id: number) {
    return this.prisma.company.delete({
      where: {
        id,
      },
    });
  }
}
