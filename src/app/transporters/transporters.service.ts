import { Injectable } from '@nestjs/common';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class TransportersService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  //  Crear un nuevo transportador
  create(createTransporterDto: CreateTransporterDto) {
    return this.prisma.transporter.create({
      data: {
        name: this.utils.capitalizeFirstLetter(createTransporterDto.name),
        lastName: this.utils.capitalizeFirstLetter(createTransporterDto.lastName),
        phone: this.utils.formatPhoneNumber(createTransporterDto.phone),
        transporterId: this.utils.formatIdentification(createTransporterDto.transporterId),
      },
    });
  }

  //  Listar todos los transportadores
  async findAll(page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [transporters, total] = await Promise.all([
      this.prisma.transporter.findMany({ take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.transporter.count()
    ])
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      transporters
    };
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
        name: this.utils.capitalizeFirstLetter(updateTransporterDto.name),
        lastName: this.utils.capitalizeFirstLetter(updateTransporterDto.lastName),
        phone: this.utils.formatPhoneNumber(updateTransporterDto.phone),
        transporterId: this.utils.formatIdentification(updateTransporterDto.transporterId),
      },
    });
  }

  //  Eliminar un transportador
  remove(id: number) {
    return this.prisma.transporter.delete({ where: { id } });
  }
}
