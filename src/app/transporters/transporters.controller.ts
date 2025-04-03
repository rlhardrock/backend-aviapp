import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() paginationDto: PaginationDto) {
    return this.transportersService.findAll(paginationDto);
  }

  // Endpoint para buscar un transportador por su id
  @Get('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.transportersService.findOne(id);
  }

  // Endpoint para buscar un transportador por su transporterId
  @Get('transporter/:taxpayer')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTransporter(@Param('taxpayer') taxpayer: string) {
    return this.transportersService.findOneTransporter(taxpayer);
  }

  // Endpoint para actualizar un transportador
  @Patch('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateTransporterDto: UpdateTransporterDto) {
    return this.transportersService.update(id, updateTransporterDto);
  }

  // Endpoint para eliminar un transportador
  @Delete('transporter/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportersService.remove(id);
  }
}