import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UsePipes, ParseUUIDPipe } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  // Endpoint para crear un nuevo benefit 
  @Post('benefit/register')
  /* @UseGuards(AuthGuard('jwt')) */  
  create(@Body(new ValidationPipe()) createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  // Endpoint para obtener todos los benefits 
  @Get('benefit/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAll(paginationDto);
  } 

  // Endpoint para obtener un benefit por id
  @Get('benefit/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitsService.findOne(id);
  }

  // Endpoint para obtener un benefit por idRemision
  @Get('benefit/idRemision/:idRemision')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneByIdRemision(@Param('idRemision') idRemision: string) {
    return this.benefitsService.findOneByIdRemision(idRemision);
  }   

  // Endpoint para obtener todos los benefits por idPlanSanitario
  @Get('benefit/idPlanSanitario/:idPlanSanitario')  
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdPlanSanitario(@Param('idPlanSanitario') idPlanSanitario: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdPlanSanitario(idPlanSanitario, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por idEmpresa
  @Get('benefit/business/:business')  
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdEmpresa(@Param('business') business: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdEmpresa(business, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por tuSupervisor (Huesped)
  @Get('benefit/licenseSup/:licenseSup')    
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByTpSupervisorPlanta(@Param('licenseSup') licenseSup: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByTpSupervisorPlanta(licenseSup, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por tpProfesional (Invitado)
  @Get('benefit/license/:license')    
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByTpProfesionalPlanta(@Param('license') license: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByTpProfesionalPlanta(license, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por placa
  @Get('benefit/plate/:plate')  
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByPlate(@Param('plate') plate: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByPlaca(plate, paginationDto);
  } 

  // Endpoint para obtener todos los benefits por idConductor
  @Get('benefit/taxpayer/:taxpayer')    
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdConductor(@Param('taxpayer') taxpayer: string, @Query() paginationDto: PaginationDto) {
    return this.benefitsService.findAllByIdConductor(taxpayer, paginationDto);
  } 

  // Endpoint para actualizar un benefit
  @Patch('benefit/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(id, updateBenefitDto);
  }

  // Endpoint para eliminar un benefit
  @Delete('benefit/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.benefitsService.remove(id);
  }
}
