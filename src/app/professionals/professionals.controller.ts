import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRolesEnum } from 'src/enums/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.SUPERVISOR, UserRolesEnum.ADMINISTRADOR, UserRolesEnum.DIRECTOR)
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  // Endpoint para crear un nuevo profesional
  @Post('professional/register')
  async  create(@Body(new ValidationPipe()) createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }

  // Endpoint para obtener todos los profesionales
  @Get('professional/list')
  @UsePipes(new ValidationPipe({ transform: true }))  
  async  findAll(@Query() paginationDto: PaginationDto) {
    return this.professionalsService.findAll(paginationDto);
  }

  // Endpoint para obtener un profesional por id
  @Get('professional/id/:id')
  async  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.professionalsService.findOne(id);
  }

  // Endpoint para obtener un profesional por taxpayer
  @Get('professional/taxpayer/:taxpayer')
  async  findByTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.professionalsService.findByTaxpayer(taxpayer);
  }

  // Endpoint para obtener un profesional por license
  @Get('professional/license/:license')
  async  findByLicense(@Param('license') license: string) {
    return this.professionalsService.findByLicense(license);
  }

  // Endpoint para obtener todos los profesionales por role
  @Get('professional/role/:role')
  @UsePipes(new ValidationPipe({ transform: true }))  
  async  findByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    return this.professionalsService.findByRole(paginationDto, role);
  }

  // Endpoint para obtener todos los profesionales por status
  @Get('professional/status/:status')
  @UsePipes(new ValidationPipe({ transform: true }))  
  async  findByStatus(@Query() paginationDto: PaginationDto, @Param('status') status: string) {
    return this.professionalsService.findByStatus(paginationDto, status);
  }

  // Endpoint para actualizar un profesional
  @Patch('professional/id/:id')
  async  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  // Endpoint para eliminar un profesional
  @Delete('professional/id/:id')
  async  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.professionalsService.remove(id);
  }
}
