import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // Endpoints para crear camiones
  @Post('truckRegister')
  /* @UseGuards(AuthGuard('jwt')) */
  async create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // Endpoints para buscar camiones
  @Get('truckList')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAll(@Query() query: PaginationDto) {
    return this.trucksService.findAll(query.page, query.limit);
  }

  // Endpoints para buscar camiones por ID
  @Get('truck/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  async findOne(@Param('id') id: string) {
    return this.trucksService.findOne(id);
  }

  // Endpoints para buscar camiones por placa
  @Get('truck/:plate')
  /* @UseGuards(AuthGuard('jwt')) */
  async findOneByPlate(@Param('plate') plate: string) {
    return this.trucksService.findOneByPlate(plate);
  }

  // Endpoints para buscar camiones por marca
  @Get('truck/:brand')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAllByBrand(@Param('brand') brand: string, @Query() query: PaginationDto) {
    return this.trucksService.findAllByBrand(brand, query.page, query.limit);
  }

  // Endpoints para buscar camiones por modelo
  @Get('truck/:model')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAllByModel(@Param('model') model: string, @Query() query: PaginationDto) {
    return this.trucksService.findAllByModel(model, query.page, query.limit);
  }

  // Endpoints para buscar camiones por color
  @Get('truck/:paint')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAllByPaint(@Param('paint') paint: string, @Query() query: PaginationDto) {
    return this.trucksService.findAllByPaint(paint, query.page, query.limit);
  }

  // Endpoints para actualizar camiones
  @Patch('truck/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async update(
    @Param('id') id: string, 
    @Body() updateTruckDto: UpdateTruckDto
  ) {
    try {
      const updatedTruck = await this.trucksService.update(id, updateTruckDto);
      if (!updatedTruck) {
        throw new HttpException('Camión no encontrado', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Camión con ID ${id} actualizado satisfactoriamente.`,
        data: updatedTruck,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Falla en la actualización del camión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoints para eliminar camiones
  @Delete('truck/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async remove(@Param('id') id: string) {
    return this.trucksService.remove(id);
  }
}
