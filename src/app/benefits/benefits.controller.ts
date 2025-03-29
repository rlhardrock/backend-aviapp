import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  // Endpoint para crear un nuevo benefit 
  @Post()
  /* @UseGuards(AuthGuard('jwt')) */  
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  // Endpoint para obtener todos los benefits 
  @Get()
  /* @UseGuards(AuthGuard('jwt')) */
  findAll() {
    return this.benefitsService.findAll();
  } 

  // Endpoint para obtener un benefit por id
  @Get(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.benefitsService.findOne(+id);
  }

  // Endpoint para obtener un benefit por idRemision
  @Get(':idRemision')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneByIdRemision(@Param('idRemision') idRemision: string) {
    return this.benefitsService.findOneByIdRemision(idRemision);
  }   

  // Endpoint para obtener todos los benefits por idPlanSanitario
  @Get(':idPlanSanitario')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdPlanSanitario(@Param('idPlanSanitario') idPlanSanitario: string) {
    return this.benefitsService.findAllByIdPlanSanitario(idPlanSanitario);
  } 

  // Endpoint para obtener todos los benefits por idEmpresa
  @Get(':idEmpresa')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdEmpresa(@Param('idEmpresa') idEmpresa: string) {
    return this.benefitsService.findAllByIdEmpresa(idEmpresa);
  } 

  // Endpoint para obtener todos los benefits por tpProfesionalPlanta
  @Get(':tpProfesionalPlanta')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByTpProfesionalPlanta(@Param('tpProfesionalPlanta') tpProfesionalPlanta: string) {
    return this.benefitsService.findAllByTpProfesionalPlanta(tpProfesionalPlanta);
  } 

  // Endpoint para obtener todos los benefits por placa
  @Get(':placa')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByPlaca(@Param('placa') placa: string) {
    return this.benefitsService.findAllByPlaca(placa);
  } 

  // Endpoint para obtener todos los benefits por idConductor
  @Get(':idConductor')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByIdConductor(@Param('idConductor') idConductor: string) {
    return this.benefitsService.findAllByIdConductor(idConductor);
  } 

  // Endpoint para actualizar un benefit
  @Patch(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(+id, updateBenefitDto);
  }

  // Endpoint para eliminar un benefit
  @Delete(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.benefitsService.remove(+id);
  }
}
