import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transporters')
export class TransportersController {
  constructor(private readonly transportersService: TransportersService) {}

  // Endpoint para crear un nuevo transportador
  @Post('transporterRegister')
 /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createTransporterDto: CreateTransporterDto) {
    return this.transportersService.create(createTransporterDto);
  }

  // Endpoint para buscar todos los transportadores
  @Get('transporterList')
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.transportersService.findAll(page, limit);
  }

  // Endpoint para buscar un transportador por su id
  @Get('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.transportersService.findOne(+id);
  }

  // Endpoint para buscar un transportador por su transporterId
  @Get('transporter/:transporterId')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTransporter(@Param('transporterId') transporterId: string) {
    return this.transportersService.findOneTransporter(transporterId);
  }

  // Endpoint para actualizar un transportador
  @Patch('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateTransporterDto: UpdateTransporterDto) {
    return this.transportersService.update(+id, updateTransporterDto);
  }

  // Endpoint para eliminar un transportador
  @Delete('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.transportersService.remove(+id);
  }
}
