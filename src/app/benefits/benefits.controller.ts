import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  // Endpoint para crear un nuevo benefit 
  @Post('benefitRegister')
  /* @UseGuards(AuthGuard('jwt')) */  
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  // Endpoint para obtener todos los benefits 
  @Get('benefitList')
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAll(page, limit);
  } 

  // Endpoint para obtener un benefit por id
  @Get('benefit/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.benefitsService.findOne(+id);
  }

  // Endpoint para obtener un benefit por idRemision
  @Get('benefit/:idRemision')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneByIdRemision(@Param('idRemision') idRemision: string) {
    return this.benefitsService.findOneByIdRemision(idRemision);
  }   

  // Endpoint para obtener todos los benefits por idPlanSanitario
  @Get('benefit/:idPlanSanitario')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdPlanSanitario(@Param('idPlanSanitario') idPlanSanitario: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAllByIdPlanSanitario(idPlanSanitario, page, limit);
  } 

  // Endpoint para obtener todos los benefits por idEmpresa
  @Get('benefit/:idEmpresa')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdEmpresa(@Param('idEmpresa') idEmpresa: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAllByIdEmpresa(idEmpresa, page, limit);
  } 

  // Endpoint para obtener todos los benefits por tpProfesionalPlanta
  @Get('benefit/:tpProfesionalPlanta')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByTpProfesionalPlanta(@Param('tpProfesionalPlanta') tpProfesionalPlanta: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAllByTpProfesionalPlanta(tpProfesionalPlanta, page, limit);
  } 

  // Endpoint para obtener todos los benefits por placa
  @Get('benefit/:placa')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByPlaca(@Param('placa') placa: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAllByPlaca(placa, page, limit);
  } 

  // Endpoint para obtener todos los benefits por idConductor
  @Get('benefit/:idConductor')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdConductor(@Param('idConductor') idConductor: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.benefitsService.findAllByIdConductor(idConductor, page, limit);
  } 

  // Endpoint para actualizar un benefit
  @Patch('benefit/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(+id, updateBenefitDto);
  }

  // Endpoint para eliminar un benefit
  @Delete('benefit/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.benefitsService.remove(+id);
  }
}
