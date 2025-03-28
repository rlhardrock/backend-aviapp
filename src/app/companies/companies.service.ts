import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';


@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}

  // Crear un nuevo empresa
  create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: this.utilsService.capitalizeFirstLetter(createCompanyDto.name),
        businessId: this.utilsService.formatIdentification(createCompanyDto.businessId),
        phone: this.utilsService.formatPhoneNumber(createCompanyDto.phone),
        email: createCompanyDto.email.toLowerCase(),
        city: this.utilsService.capitalizeFirstLetter(createCompanyDto.city),
      },
    });
  }

  // Listar todos los empresas
  findAll() {
    return this.prisma.company.findMany();
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
        name: this.utilsService.capitalizeFirstLetter(updateCompanyDto.name),
        businessId: this.utilsService.formatIdentification(updateCompanyDto.businessId),
        phone: this.utilsService.formatPhoneNumber(updateCompanyDto.phone),
        email: updateCompanyDto.email.toLowerCase(),
        city: this.utilsService.capitalizeFirstLetter(updateCompanyDto.city),
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
