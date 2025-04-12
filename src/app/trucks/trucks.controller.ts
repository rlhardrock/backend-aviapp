import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, HttpException, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';
import { FilterTruckDto } from './dto/filter-truck.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // Endpoints para crear camiones
  @UseGuards(JwtAuthGuard)
  @Post('truck/register')
  async create(@Body(new ValidationPipe()) createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // Endpoints para buscar camiones
  @Get('truck/list')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.trucksService.findAll(paginationDto);
  }

  // Endpoints para buscar camiones por ID
  @UseGuards(JwtAuthGuard)
  @Get('truck/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  // Endpoints para buscar camiones por placa
  @UseGuards(JwtAuthGuard)
  @Get('truck/plate/:plate')
  async findOneByPlate(@Param('plate') plate: string) {
    return this.trucksService.findOneByPlate(plate);
  }

  // Endpoints para buscar camiones por marca
  @Get('truck/brand')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByBrand(@Query() filterTruckDto: FilterTruckDto) {
    return this.trucksService.findAllByBrand(filterTruckDto);
  }

  // Endpoints para buscar camiones por color
  @Get('truck/paint') 
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByPaint(@Query() filterTruckDto: FilterTruckDto) {
    return this.trucksService.findAllByPaint(filterTruckDto);
  }

  // Endpoints para actualizar camiones
  @Patch('truck/id/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(id, updateTruckDto);
  }
    
  // Endpoints para eliminar camiones
  @UseGuards(JwtAuthGuard)
  @Delete('truck/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.remove(id);
  }
}