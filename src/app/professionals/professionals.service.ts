import { Injectable } from '@nestjs/common';
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
  create(createProfessionalDto: CreateProfessionalDto) {
    return this.prisma.professional.create({
      data: {
        sex: this.utils.capitalizeFirstLetter(createProfessionalDto.sex),
        licenseId: this.utils.capitalizeFirstLetter(createProfessionalDto.licenseId),
        name: this.utils.capitalizeFirstLetter(createProfessionalDto.name),
        lastName: this.utils.capitalizeFirstLetter(createProfessionalDto.lastName),
        phone: this.utils.formatPhoneNumber(createProfessionalDto.phone),
        taxpayerId: this.utils.formatIdentification(createProfessionalDto.taxpayerId),
        email: createProfessionalDto.email.toLowerCase(),
        role: this.utils.capitalizeFirstLetter(createProfessionalDto.role),
        status: this.utils.capitalizeFirstLetter(createProfessionalDto.status),
      },
    });
  }

  // Listar todos los profesionales
  findAll() {
    return this.prisma.professional.findMany();
  }

  // Encontrar un profesional por id
  findOne(id: number) {
    return this.prisma.professional.findUnique({
      where: {
        id,
      },
    });
  }

  // Encontrar un profesional por licenseId
  findByLicenseId(licenseId: string) {
    return this.prisma.professional.findUnique({
      where: {
        licenseId,
      },
    });
  }

  // Encontrar un profesional por rol
  findByRole(role: string) {
    return this.prisma.professional.findMany({
      where: {
        role,
      },
    });
  }

  // Encontrar un profesional por status
  findByStatus(status: string) {
    return this.prisma.professional.findMany({
      where: {
        status,
      },
    });
  }

  // Encontrar un profesional por taxpayerId
  findByTaxpayerId(taxpayerId: string) {
    return this.prisma.professional.findUnique({
      where: {
        taxpayerId,
      },
    });
  }

  // Actualizar un profesional
  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return this.prisma.professional.update({
      where: {
        id,
      },
      data: {
        sex: this.utils.capitalizeFirstLetter(updateProfessionalDto.sex),
        licenseId: this.utils.capitalizeFirstLetter(updateProfessionalDto.licenseId),
        name: this.utils.capitalizeFirstLetter(updateProfessionalDto.name),
        lastName: this.utils.capitalizeFirstLetter(updateProfessionalDto.lastName),
        phone: this.utils.formatPhoneNumber(updateProfessionalDto.phone),
        taxpayerId: this.utils.formatIdentification(updateProfessionalDto.taxpayerId),
        email: updateProfessionalDto.email.toLowerCase(),
        role: this.utils.capitalizeFirstLetter(updateProfessionalDto.role),
        status: this.utils.capitalizeFirstLetter(updateProfessionalDto.status),
      },
    });
  }

  remove(id: number) {
    return this.prisma.professional.delete({
      where: {
        id,
      },
    });
  }
}
