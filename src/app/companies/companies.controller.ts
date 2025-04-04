import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('company/register')
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('company/list')
  @UsePipes(new ValidationPipe({ transform: true }))  
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }

  @Get('company/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @Get('company/business/:business')
  /* @UseGuards(AuthGuard('jwt')) */
  findByBusiness(@Param('business') business: string) {
    return this.companiesService.findByBusiness(business);
  }

  @Get('company/name/:name')
  /* @UseGuards(AuthGuard('jwt')) */
  findByName(@Param('name') name: string) {
    return this.companiesService.findByName(name);
  }

  @Patch('company/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete('company/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
