import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UsePipes, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRolesEnum } from 'src/enums/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.SUPERVISOR, UserRolesEnum.RECEPTOR)
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  // Endpoint para crear un nuevo benefit 
  @Post('benefit/register')
  async create(@Body(new ValidationPipe()) createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  // Endpoint para obtener todos los benefits 
  @Get('benefit/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAll(paginationDto);
  } 

  // Endpoint para obtener un benefit por id
  @Get('benefit/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitsService.findOne(id);
  }

  // Endpoint para obtener un benefit por idRemision
  @Get('benefit/idRemision/:idRemision')
  async findOneByIdRemision(@Param('idRemision') idRemision: string) {
    return this.benefitsService.findOneByIdRemision(idRemision);
  }   

  // Endpoint para obtener todos los benefits por idPlanSanitario
  @Get('benefit/idPlanSanitario/:idPlanSanitario')  
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByIdPlanSanitario(@Param('idPlanSanitario') idPlanSanitario: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdPlanSanitario(idPlanSanitario, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por idEmpresa
  @Get('benefit/business/:business')  
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByIdEmpresa(@Param('business') business: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdEmpresa(business, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por tuSupervisor (Huesped)
  @Get('benefit/licenseSup/:licenseSup')    
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByTpSupervisorPlanta(@Param('licenseSup') licenseSup: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByTpSupervisorPlanta(licenseSup, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por tpProfesional (Invitado)
  @Get('benefit/license/:license')    
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByTpProfesionalPlanta(@Param('license') license: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByTpProfesionalPlanta(license, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por placa
  @Get('benefit/plate/:plate')  
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByPlate(@Param('plate') plate: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByPlaca(plate, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por idConductor
  @Get('benefit/taxpayer/:taxpayer')    
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByIdConductor(@Param('taxpayer') taxpayer: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdConductor(taxpayer, paginationDto);
  } 

  // Endpoint para actualizar un benefit
  @Patch('benefit/id/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(id, updateBenefitDto);
  }

  // Endpoint para eliminar un benefit
  @Delete('benefit/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitsService.remove(id);
  }
}
