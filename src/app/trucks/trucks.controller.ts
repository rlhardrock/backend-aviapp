import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // Endpoints para crear camiones
  @Post()
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // Endpoints para buscar camiones
  @Get()
  /* @UseGuards(AuthGuard('jwt')) */
  findAll() {
    return this.trucksService.findAll();
  }

  // Endpoints para buscar camiones por ID
  @Get(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.trucksService.findOne(+id);
  }

  // Endpoints para buscar camiones por placa
  @Get(':plate')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneByPlate(@Param('plate') plate: string) {
    return this.trucksService.findOneByPlate(plate);
  }

  // Endpoints para buscar camiones por marca
  @Get(':brand')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByBrand(@Param('brand') brand: string) {
    return this.trucksService.findAllByBrand(brand);
  }

  // Endpoints para buscar camiones por modelo
  @Get(':model')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByModel(@Param('model') model: string) {
    return this.trucksService.findAllByModel(model);
  }

  // Endpoints para buscar camiones por color
  @Get(':paint')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByPaint(@Param('paint') paint: string) {
    return this.trucksService.findAllByPaint(paint);
  }

  // Endpoints para actualizar camiones
  @Patch(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(+id, updateTruckDto);
  }

  // Endpoints para eliminar camiones
  @Delete(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.trucksService.remove(+id);
  }
}
