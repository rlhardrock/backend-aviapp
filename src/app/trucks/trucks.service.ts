import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UtilsService } from '../utils/utils.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../utils/pagination.dto';
import { contains } from 'class-validator';


@Injectable()
export class TrucksService {

  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}
  
  // Crear un nuevo camión
  async create(createTruckDto: CreateTruckDto) {
    try {
      const existingTruck = this.utils.formatString(createTruckDto.plate);
      const truck = await this.prisma.truck.findFirst({where: { plate: { contains: existingTruck.trim(),  mode: 'insensitive' } },
      });
      if (truck) {
        throw new ConflictException(`El camión con placa ${createTruckDto.plate} ya existe.`);
      }
      const currentYear = new Date().getFullYear();
      if (createTruckDto.year < 1950 || createTruckDto.year > currentYear) {
        throw new BadRequestException(`El año ${createTruckDto.year} no es válido.`);
      }
      const formattedTruckData = await this.prisma.truck.create({
        data: {
          brand: this.utils.capitalizeFirstLetter(createTruckDto.brand),
          model: this.utils.capitalizeFirstLetter(createTruckDto.model),
          paint: this.utils.capitalizeFirstLetter(createTruckDto.paint),
          year: createTruckDto.year,
          plate: this.utils.formatString(createTruckDto.plate),
          trailer: this.utils.capitalizeFirstLetter(createTruckDto.trailer),
        },
      });
      const newTruck = await this.prisma.truck.create({
        data:{
          ...formattedTruckData
        }
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Camión creado con éxito.',
        newTruck,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado al crear el camión.');
    }
  }

  // Encuentra todos los camiones
  async findAll(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const { take, skip } = this.utils.paginateList(page, limit);
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.truck.count(),
      ]);
      if (total === 0) {
        throw new NotFoundException('No se encontraron camiones');
      }
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
  
  // Encuentra un camión por ID
  async findOne(id: string) {
    try {
      const truck = await this.prisma.truck.findUnique({ where: { id } });
      if (!truck) {
        throw new NotFoundException(`Camión con ID ${id} no encontrado.`);
      }
      return truck;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra un camión por placa
  async findOneByPlate(plate: string) {
    try {
      const normalizedTruck = this.utils.formatString(plate);
      const truck = await this.prisma.truck.findFirst({where: { plate: { contains: normalizedTruck.trim(),  mode: 'insensitive' } },
      });
      if (!truck) {
        throw new NotFoundException(`No se encontró un camión con la placa: ${plate}`);
      }
      return truck;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }
  
  // Encuentra todos los camiones por marca
  async findAllByBrand(brand: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const brandFilter = this.utils.caseInsensitiveContains(brand);
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ where: { brand: brandFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.truck.count({ where: { brand: brandFilter } }),
      ]);
      if ( total === 0 ) {
        throw new NotFoundException(`No se encontraron camiones con la marca ${brand}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de camiones con la marca ${brand}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra todos los camiones por modelo
  async findAllByModel(model: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const modelFilter = this.utils.caseInsensitiveContains(model);
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ where: { model: modelFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
        this.prisma.truck.count({ where: { model: modelFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron camiones con el modelo: ${model}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de camiones con el modelo ${model}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Encuentra todos los camiones por color
  async findAllByPaint(paint: string, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const { take, skip } = this.utils.paginateList(page, limit);
      const paintFilter = this.utils.caseInsensitiveContains(paint);
      const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where: { paint: paintFilter }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where: { paint: paintFilter } }),
      ]);
      if (total === 0) {
        throw new NotFoundException(`No se encontraron camiones con el color: ${paint}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Lista de camiones con el color: ${paint}`,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
    }
  }

  // Actualizar un camión existente
  async update(id: string, updateTruckDto: UpdateTruckDto) {
    try {
      const existingTruck = await this.prisma.truck.findUnique({ where: { id } });
      if (!existingTruck) {
        throw new HttpException('Camión no encontrado', HttpStatus.NOT_FOUND);
      }
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
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
      }
      throw new InternalServerErrorException('Ha ocurrido un error inesperado.');
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