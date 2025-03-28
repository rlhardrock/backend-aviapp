import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UtilsService } from '../utils/utils.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrucksService {

  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}

  // Crear un nuevo camión
  async create(createTruckDto: CreateTruckDto) {
    return this.prisma.truck.create({
      data: {
        brand: this.utilsService.capitalizeFirstLetter(createTruckDto.brand),
        model: this.utilsService.capitalizeFirstLetter(createTruckDto.model),
        paint: this.utilsService.capitalizeFirstLetter(createTruckDto.paint),
        year: createTruckDto.year,
        plate: this.utilsService.formatString(createTruckDto.plate),
      },
    });
  }

  // Encuentra todos los camiones
  async findAll() {
    return this.prisma.truck.findMany();
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
  async findAllByBrand(brand: string) {
    return this.prisma.truck.findMany({
      where: { brand },
    });
  }

  // Encuentra todos los camiones por modelo
  async findAllByModel(model: string) {
    return this.prisma.truck.findMany({
      where: { model },
    });
  }

  // Encuentra todos los camiones por color
  async findAllByPaint(paint: string) {
    return this.prisma.truck.findMany({
      where: { paint },
    });
  }

  // Actualizar un camión existente
  async update(id: number, updateTruckDto: UpdateTruckDto) {
    return this.prisma.truck.update({
      where: { id },
      data: {
        brand: this.utilsService.capitalizeFirstLetter(updateTruckDto.brand),
        model: this.utilsService.capitalizeFirstLetter(updateTruckDto.model),
        paint: this.utilsService.capitalizeFirstLetter(updateTruckDto.paint),
        year: updateTruckDto.year,
        plate: this.utilsService.formatString(updateTruckDto.plate),
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
