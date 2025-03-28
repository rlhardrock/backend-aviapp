import { Injectable } from '@nestjs/common';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class TransportersService {

  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}

  //  Crear un nuevo transportador
  create(createTransporterDto: CreateTransporterDto) {
    return this.prisma.transporter.create({
      data: {
        name: this.utilsService.capitalizeFirstLetter(createTransporterDto.name),
        lastName: this.utilsService.capitalizeFirstLetter(createTransporterDto.lastName),
        phone: this.utilsService.formatPhoneNumber(createTransporterDto.phone),
        transporterId: this.utilsService.formatIdentification(createTransporterDto.transporterId),
      },
    });
  }

  //  Listar todos los transportadores
  findAll() {
    return this.prisma.transporter.findMany();
  }

  //  Buscar un transportador por su id
  findOne(id: number) {
    return this.prisma.transporter.findUnique({ where: { id } });
  }

  //  Buscar un transportador por su transporterId
  findOneTransporter(transporterId: string) {
    return this.prisma.transporter.findUnique({ where: { transporterId } });
  }

  //  Actualizar un transportador
  update(id: number, updateTransporterDto: UpdateTransporterDto) {
    return  this.prisma.transporter.update({
      where: { id },
      data: {
        name: this.utilsService.capitalizeFirstLetter(updateTransporterDto.name),
        lastName: this.utilsService.capitalizeFirstLetter(updateTransporterDto.lastName),
        phone: this.utilsService.formatPhoneNumber(updateTransporterDto.phone),
        transporterId: this.utilsService.formatIdentification(updateTransporterDto.transporterId),
      },
    });
  }

  //  Eliminar un transportador
  remove(id: number) {
    return this.prisma.transporter.delete({ where: { id } });
  }
}
