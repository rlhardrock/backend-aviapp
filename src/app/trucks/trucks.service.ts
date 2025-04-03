import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UtilsService } from '../utils/utils.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../utils/pagination.dto';


@Injectable()
export class TrucksService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  // Crear un nuevo camión
  async create(createTruckDto: CreateTruckDto) {
    try {
      const existingTruck = await this.prisma.truck.findUnique({
        where: { plate: createTruckDto.plate },
      });
      if (existingTruck) {
        throw new ConflictException(`El camión con placa ${createTruckDto.plate} ya existe.`);
      }
      const currentYear = new Date().getFullYear();
      if (createTruckDto.year < 1950 || createTruckDto.year > currentYear) {
        throw new BadRequestException(`El año ${createTruckDto.year} no es válido.`);
      }
      const newTruck = await this.prisma.truck.create({
        data: {
          brand: this.utils.capitalizeFirstLetter(createTruckDto.brand),
          model: this.utils.capitalizeFirstLetter(createTruckDto.model),
          paint: this.utils.capitalizeFirstLetter(createTruckDto.paint),
          year: createTruckDto.year,
          plate: this.utils.formatString(createTruckDto.plate),
          trailer: this.utils.capitalizeFirstLetter(createTruckDto.trailer),
        },
      });
      return {
        message: 'Camión creado con éxito',
        truck: newTruck,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encuentra todos los camiones
  async findAll(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.truck.count(),
      ]);
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de camiones',
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }
  
  // Encuentra un camión por ID
  async findOne(id: string) {
    if (!id || !this.utils.validateUUID(id)) {
      throw new BadRequestException('El ID debe ser un UUID válido.');
    }
    try {
      const truck = await this.prisma.truck.findUnique({
        where: { id },
      });
      if (!truck) {
        throw new NotFoundException(`Camión con ID ${id} no encontrado.`);
      }
      return truck;
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encuentra un camión por placa
  async findOneByPlate(plate: string) {
    try {
      const truck = await this.prisma.truck.findFirst({
        where: { plate: { contains: plate.trim(),  mode: 'insensitive' } },
      });
      if (!truck) {
        throw new NotFoundException(`No se encontró un camión con la placa: ${plate}`);
      }
      return truck;
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }
  
  // Encuentra todos los camiones por marca
  async findAllByBrand(brand: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const where = { brand: { equals: brand, mode: 'insensitive' } };
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.truck.count({ where }),
      ]);
      if ( total === 0 ) {
        throw new NotFoundException(`No se encontraron camiones con la marca ${brand}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de camiones con la marca: ' + brand,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encuentra todos los camiones por modelo
  async findAllByModel(model: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const where = {
        model: { equals: model, mode: 'insensitive' },
      };
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.truck.count({ where }),
      ]);
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de camiones con el modelo: ' + model,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Encuentra todos los camiones por color
  async findAllByPaint(paint: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const where = { paint: { equals: paint, mode: 'insensitive' } };
      const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where }),
      ]);
      return {
        statusCode: HttpStatus.OK,
        message: 'Lista de camiones con el color: ' + paint,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Actualizar un camión existente
  async update(id: string, updateTruckDto: UpdateTruckDto) {
    if (!this.utils.validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    if (!updateTruckDto.brand || !updateTruckDto.model || !updateTruckDto.paint || !updateTruckDto.year || !updateTruckDto.plate) {
      throw new BadRequestException('Faltan campos obligatorios');
    }
    try {
      const updatedTruck = await this.prisma.truck.update({
        where: { id },
        data: {
          brand: this.utils.capitalizeFirstLetter(updateTruckDto.brand),
          model: this.utils.capitalizeFirstLetter(updateTruckDto.model),
          paint: this.utils.capitalizeFirstLetter(updateTruckDto.paint),
          year: updateTruckDto.year,
          plate: this.utils.formatString(updateTruckDto.plate),
          trailer: this.utils.capitalizeFirstLetter(updateTruckDto.trailer),
        },
      });
      return updatedTruck;
    } catch (error) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error?.response?.message || 'Ha ocurrido un error inesperado';
      throw new HttpException({ 
        statusCode: status, 
        message 
      }, status);
    }
  }

  // Eliminar un camión existente
  async remove(id: string) {
    try {
      await this.prisma.truck.delete({ where: { id } });
      return { message: `Camión con ID ${id} eliminado correctamente.` }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`El camión con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
}