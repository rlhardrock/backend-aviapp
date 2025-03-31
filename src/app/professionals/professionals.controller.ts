import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { AuthGuard } from '@nestjs/passport';

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
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.professionalsService.findAll(page, limit);
  }

  // Endpoint para obtener un profesional por id
  @Get('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(+id);
  }

  // Endpoint para obtener un profesional por taxpayerId
  @Get('professional/:taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  findByTaxpayerId(@Param('taxpayerId') taxpayerId: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.professionalsService.findByTaxpayerId(taxpayerId, page, limit);
  }

  // Endpoint para obtener un profesional por licenseId
  @Get('professional/:licenseId')
  /*  @UseGuards(AuthGuard('jwt')) */
  findByLicenseId(@Param('licenseId') licenseId: string) {
    return this.professionalsService.findByLicenseId(licenseId);
  }

  // Endpoint para obtener un profesional por role
  @Get('professional/:role')
  /* @UseGuards(AuthGuard('jwt')) */
  findByRole(@Param('role') role: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.professionalsService.findByRole(role, page, limit);
  }

  // Endpoint para obtener un profesional por status
  @Get('professional/:status')
  /* @UseGuards(AuthGuard('jwt')) */
  findByStatus(@Param('status') status: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.professionalsService.findByStatus(status, page, limit);
  }

  // Endpoint para actualizar un profesional
  @Patch('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(+id, updateProfessionalDto);
  }

  // Endpoint para eliminar un profesional
  @Delete('professional/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(+id);
  }
}
