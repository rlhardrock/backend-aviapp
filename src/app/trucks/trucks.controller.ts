import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';
import { FilterTruckDto } from './dto/filter-truck.dto';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // Endpoints para crear camiones
  @Post('truck/register')
  /* @UseGuards(AuthGuard('jwt')) */
  async create(@Body(new ValidationPipe()) createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // Endpoints para buscar camiones
  @Get('truck/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.trucksService.findAll(paginationDto);
  }

  // Endpoints para buscar camiones por ID
  @Get('truck/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  // Endpoints para buscar camiones por placa
  @Get('truck/plate/:plate')
  /* @UseGuards(AuthGuard('jwt')) */
  async findOneByPlate(@Param('plate') plate: string) {
    return this.trucksService.findOneByPlate(plate);
  }

  // Endpoints para buscar camiones por marca
  @Get('truck/brand')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAllByBrand(@Query() filterTruckDto: FilterTruckDto) {
    return this.trucksService.findAllByBrand(filterTruckDto);
  }

  // Endpoints para buscar camiones por color
  @Get('truck/paint') 
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async findAllByPaint(@Query() filterTruckDto: FilterTruckDto) {
    return this.trucksService.findAllByPaint(filterTruckDto);
  }

  // Endpoints para actualizar camiones
  @Patch('truck/id/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(id, updateTruckDto);
  }
    
  // Endpoints para eliminar camiones
  @Delete('truck/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.remove(id);
  }
}