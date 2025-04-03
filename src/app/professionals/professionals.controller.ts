import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  // Endpoint para crear un nuevo profesional
  @Post('professionalRegister')
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }

  // Endpoint para obtener todos los profesionales
  @Get('professionalList')
  @UsePipes(new ValidationPipe({ transform: true }))  
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() paginationDto: PaginationDto) {
    return this.professionalsService.findAll(paginationDto);
  }

  // Endpoint para obtener un profesional por id
  @Get('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  // Endpoint para obtener un profesional por taxpayer
  @Get('professional/:taxpayer')
  /* @UseGuards(AuthGuard('jwt')) */
  findByTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.professionalsService.findByTaxpayer(taxpayer);
  }

  // Endpoint para obtener un profesional por license
  @Get('professional/:license')
  /*  @UseGuards(AuthGuard('jwt')) */
  findByLicense(@Param('license') license: string) {
    return this.professionalsService.findByLicense(license);
  }

  // Endpoint para obtener todos los profesionales por role
  @Get('professional/:role')
  @UsePipes(new ValidationPipe({ transform: true }))  
  /* @UseGuards(AuthGuard('jwt')) */
  findByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    return this.professionalsService.findByRole(role, paginationDto);
  }

  // Endpoint para obtener todos los profesionales por status
  @Get('professional/:status')
  @UsePipes(new ValidationPipe({ transform: true }))  
  /* @UseGuards(AuthGuard('jwt')) */
  findByStatus(@Param('status') status: string, @Query() paginationDto: PaginationDto) {
    return this.professionalsService.findByStatus(status, paginationDto);
  }

  // Endpoint para actualizar un profesional
  @Patch('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  // Endpoint para eliminar un profesional
  @Delete('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.professionalsService.remove(id);
  }
}
