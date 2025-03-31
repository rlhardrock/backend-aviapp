import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // Endpoints para crear camiones
  @Post('truckRegister')
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // Endpoints para buscar camiones
  @Get('truckList')
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.trucksService.findAll(page, limit);
  }

  // Endpoints para buscar camiones por ID
  @Get('truck/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.trucksService.findOne(+id);
  }

  // Endpoints para buscar camiones por placa
  @Get('truck/:plate')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneByPlate(@Param('plate') plate: string) {
    return this.trucksService.findOneByPlate(plate);
  }

  // Endpoints para buscar camiones por marca
  @Get('truck/:brand')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByBrand(@Param('brand') brand: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.trucksService.findAllByBrand(brand, page, limit);
  }

  // Endpoints para buscar camiones por modelo
  @Get('truck/:model')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByModel(@Param('model') model: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.trucksService.findAllByModel(model, page, limit);
  }

  // Endpoints para buscar camiones por color
  @Get('truck/:paint')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByPaint(@Param('paint') paint: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.trucksService.findAllByPaint(paint, page, limit);
  }

  // Endpoints para actualizar camiones
  @Patch('truck/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(+id, updateTruckDto);
  }

  // Endpoints para eliminar camiones
  @Delete('truck/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.trucksService.remove(+id);
  }
}
