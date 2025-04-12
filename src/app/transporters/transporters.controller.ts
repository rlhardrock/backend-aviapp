import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transporters')
export class TransportersController {
  constructor(private readonly transportersService: TransportersService) {}

  // Endpoint para crear un nuevo transportador
  @UseGuards(JwtAuthGuard)
  @Post('transporter/register')
  async create(@Body(new ValidationPipe({ whitelist: true, transform: true })) createTransporterDto: CreateTransporterDto) {
    return this.transportersService.create(createTransporterDto);
  }

  // Endpoint para buscar todos los transportadores
  @UseGuards(JwtAuthGuard)
  @Get('transporter/list') 
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.transportersService.findAll(paginationDto);
  }

  // Endpoint para buscar un transportador por su id
  @UseGuards(JwtAuthGuard)
  @Get('transporter/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportersService.findOne(id);
  }

  // Endpoint para buscar un transportador por su transporterId
  @UseGuards(JwtAuthGuard)
  @Get('transporter/taxpayer/:taxpayer')
  async findOneTransporter(@Param('taxpayer') taxpayer: string) {
    return this.transportersService.findOneTransporter(taxpayer);
  }

  // Endpoint para actualizar un transportador
  @UseGuards(JwtAuthGuard)
  @Patch('transporter/id/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTransporterDto: UpdateTransporterDto) {
    return this.transportersService.update(id, updateTransporterDto);
  }

  // Endpoint para eliminar un transportador
  @UseGuards(JwtAuthGuard)
  @Delete('transporter/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportersService.remove(id);
  }
}