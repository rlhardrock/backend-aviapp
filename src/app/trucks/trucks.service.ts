import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UtilsService } from '../utils/utils.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrucksService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  // Crear un nuevo camión
  async create(createTruckDto: CreateTruckDto) {
    return this.prisma.truck.create({
      data: {
        brand: this.utils.capitalizeFirstLetter(createTruckDto.brand),
        model: this.utils.capitalizeFirstLetter(createTruckDto.model),
        paint: this.utils.capitalizeFirstLetter(createTruckDto.paint),
        year: createTruckDto.year,
        plate: this.utils.formatString(createTruckDto.plate),
      },
    });
  }

  // Encuentra todos los camiones
  async findAll(page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count()
    ])
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      trucks,
    };
  }

  // Encuentra un camión por ID
  async findOne(id: number) {
    return this.prisma.truck.findUnique({
      where: { id },
    });
  }

  // Encuentra un camión por placa
  async findOneByPlate(plate: string) {
    return this.prisma.truck.findUnique({
      where: { plate },
    });
  }
  
  // Encuentra todos los camiones por marca
  async findAllByBrand(brand: string  , page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where: { brand }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where: { brand } }),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      trucks,
    };
  }

  // Encuentra todos los camiones por modelo
  async findAllByModel(model: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where: { model }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where: { model } }),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      trucks,
    };
  }

  // Encuentra todos los camiones por color
  async findAllByPaint(paint: string, page: number, limit: number) {
    const { take, skip } = this.utils.paginateList(page, limit);
    const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where: { paint }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where: { paint } }),
    ]);
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      trucks,
    };
  }

  // Actualizar un camión existente
  async update(id: number, updateTruckDto: UpdateTruckDto) {
    return this.prisma.truck.update({
      where: { id },
      data: {
        brand: this.utils.capitalizeFirstLetter(updateTruckDto.brand),
        model: this.utils.capitalizeFirstLetter(updateTruckDto.model),
        paint: this.utils.capitalizeFirstLetter(updateTruckDto.paint),
        year: updateTruckDto.year,
        plate: this.utils.formatString(updateTruckDto.plate),
      },
    });
  }

  // Eliminar un camión existente
  async remove(id: number) {
    return this.prisma.truck.delete({
      where: { id },
    });
  }
}
