import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
       if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un camión con los mismos datos.');
      }
      throw new InternalServerErrorException('Ocurrió un error al crear el camión.');
    }
  }

  // Encuentra todos los camiones
  async findAll(page: number, limit: number) {
    try {
      if (!page || page < 1) throw new BadRequestException('La página debe ser un número entero positivo.');
      if (!limit || limit < 1) throw new BadRequestException('El limite debe ser un número entero positivo.');
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
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        data: trucks
      };
    } catch (error) {
      console.error('Error buscando camiones:', error);
    throw new HttpException(
      `Error al obtener los camiones: ${error.message || error}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
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
      console.error('Error buscando camión por ID:', error);
    throw new HttpException(
      `Error al buscar camión con ID ${id}: ${error.message || error}`,
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
    }
  }

  // Encuentra un camión por placa
  async findOneByPlate(plate: string) {
    try {
      if (!plate || plate.trim().length === 0) {
        throw new NotFoundException('La placa debe ser un string válido.');
      }
      const truck = await this.prisma.truck.findFirst({
        where: { plate: { contains: plate.trim(),  mode: 'insensitive' } },
      });
      if (!truck) {
        throw new NotFoundException(`No se encontró un camión con la placa: ${plate}`);
      }
      return truck;
    } catch (error) {
      console.error('Error buscando camión por placa:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        `Error al buscar camión por placa: ${error.message || error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    }
  }
  
  // Encuentra todos los camiones por marca
  async findAllByBrand(brand: string  , page: number, limit: number) {
    try {
      if (!brand || typeof brand !== 'string') {
        throw new BadRequestException('La marca debe ser un string válido.');
      }
      if (!page || page < 1 || !Number.isInteger(page)) {
        throw new BadRequestException('La página debe ser un número entero positivo.');
      }
      if (!limit || limit < 1 || !Number.isInteger(limit)) {
        throw new BadRequestException('El limite debe ser un número entero positivo.');
      }
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
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        trucks,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Database constraint violation.');
      }
      throw error;
    }
  }

  // Encuentra todos los camiones por modelo
  async findAllByModel(model: string, page: number, limit: number) {
    try {
      if (!model || typeof model !== 'string') {
        throw new BadRequestException('El modelo debe ser un string válido.');
      }
      if (!page || page < 1 || !Number.isInteger(page)) {
        throw new BadRequestException('La página debe ser un número entero positivo.');
      }
      if (!limit || limit < 1 || !Number.isInteger(limit)) {
        throw new BadRequestException('El limite debe ser un número entero positivo.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const where = {
        model: { equals: model, mode: 'insensitive' },
      };
      const [trucks, total] = await Promise.all([
        this.prisma.truck.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where }),
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
    } catch (error) {
      // Manejo de errores de Prisma
      if (error.code === 'P2002') {
        throw new BadRequestException('Database constraint violation.');
      }
      throw error;
    }
  }

  // Encuentra todos los camiones por color
  async findAllByPaint(paint: string, page: number, limit: number) {
    try {
      if (!paint || typeof paint !== 'string') {
        throw new BadRequestException('El color debe ser un string válido.');
      }
      if (!page || page < 1 || !Number.isInteger(page)) {
        throw new BadRequestException('La página debe ser un número entero positivo.');
      }
      if (!limit || limit < 1 || !Number.isInteger(limit)) {
        throw new BadRequestException('El limite debe ser un número entero positivo.');
      }
      const { take, skip } = this.utils.paginateList(page, limit);
      const where = {
        paint: { equals: paint, mode: 'insensitive' },
      };
      const [trucks, total] = await Promise.all([
      this.prisma.truck.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.truck.count({ where }),
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
    } catch (error) {
      // Manejo de errores de Prisma
      if (error.code === 'P2002') {
        throw new BadRequestException('Database constraint violation.');
      }
      throw new HttpException(error.message || 'Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(
        `Falla en la actualización del camión: ${error.message || error}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar un camión existente
  async remove(id: string) {
    if (!this.utils.validateUUID(id)) {
      throw new HttpException('El ID proporcionado no es válido.', HttpStatus.BAD_REQUEST);
    }
    try {
      const deletedTruck = await this.prisma.truck.delete({
        where: { id },
      });
      if (!deletedTruck) {
        throw new NotFoundException(`El camión con ID ${id} no fue encontrado.`);
      }
      return {
        message: `Camión con ID ${id} eliminado correctamente.`,
        data: deletedTruck,
      };
    } catch (error) {
      throw new HttpException(
        `Falla al eliminar el camión: ${error.message || error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
