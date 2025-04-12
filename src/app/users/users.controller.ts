import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @UseGuards(JwtAuthGuard)
  @Post('user/register')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @UseGuards(JwtAuthGuard)
  @Get('user/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  // Endpoint para obtener todos los usuarios por rol
  @UseGuards(JwtAuthGuard)
  @Get('user/role/:role')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByRole(paginationDto, role);
  }

  // Endpoint para obtener todos los usuarios por estado  
  @UseGuards(JwtAuthGuard)
  @Get('user/status/:status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByStatus(@Param('status') status: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByStatus(paginationDto, status);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @UseGuards(JwtAuthGuard)
  @Get('user/taxpayer/:taxpayer')
  async findOneTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.usersService.findOneTaxpayer(taxpayer);
  }

  // Endpoint para obtener un usuario por numero de licencia profesional
  @UseGuards(JwtAuthGuard)
  @Get('user/license/:license')
  async findOneLicense(@Param('license') license: string) {
    return this.usersService.findOneLicense(license);
  }

  // Endpoint para obtener un usuario por id
  @UseGuards(JwtAuthGuard)
  @Get('user/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // Endpoint para actualizar un usuario
  @UseGuards(JwtAuthGuard)
  @Patch('user/id/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @UseGuards(JwtAuthGuard)
  @Delete('user/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
  
}
