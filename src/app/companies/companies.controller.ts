import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRolesEnum } from 'src/enums/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.SUPERVISOR, UserRolesEnum.ADMINISTRADOR)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('company/register')
  async create(@Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('company/list')
  @UsePipes(new ValidationPipe({ transform: true }))  
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }

  @Get('company/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @Get('company/business/:business')
  async findByBusiness(@Param('business') business: string) {
    return this.companiesService.findByBusiness(business);
  }

  @Get('company/name/:name')
  async findByName(@Param('name') name: string) {
    return this.companiesService.findByName(name);
  }

  @Patch('company/id/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete('company/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
