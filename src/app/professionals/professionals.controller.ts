import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  // Endpoint para crear un nuevo profesional
  @Post()
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }

  // Endpoint para obtener todos los profesionales
  @Get()
  /* @UseGuards(AuthGuard('jwt')) */
  findAll() {
    return this.professionalsService.findAll();
  }

  // Endpoint para obtener un profesional por id
  @Get(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(+id);
  }

  // Endpoint para obtener un profesional por taxpayerId
  @Get(':taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  findByTaxpayerId(@Param('taxpayerId') taxpayerId: string) {
    return this.professionalsService.findByTaxpayerId(taxpayerId);
  }

  // Endpoint para obtener un profesional por licenseId
  @Get(':licenseId')
  /*  @UseGuards(AuthGuard('jwt')) */
  findByLicenseId(@Param('licenseId') licenseId: string) {
    return this.professionalsService.findByLicenseId(licenseId);
  }

  // Endpoint para obtener un profesional por role
  @Get(':role')
  /* @UseGuards(AuthGuard('jwt')) */
  findByRole(@Param('role') role: string) {
    return this.professionalsService.findByRole(role);
  }

  // Endpoint para obtener un profesional por status
  @Get(':status')
  /* @UseGuards(AuthGuard('jwt')) */
  findByStatus(@Param('status') status: string) {
    return this.professionalsService.findByStatus(status);
  }

  // Endpoint para actualizar un profesional
  @Patch(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(+id, updateProfessionalDto);
  }

  // Endpoint para eliminar un profesional
  @Delete(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(+id);
  }
}
