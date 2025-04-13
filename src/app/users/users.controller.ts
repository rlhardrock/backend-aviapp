import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UsePipes, ValidationPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../utils/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRolesEnum } from 'src/enums/user-roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRolesEnum.SUPERVISOR, UserRolesEnum.ADMINISTRADOR, UserRolesEnum.DIRECTOR)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @Post('user/register')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @Get('user/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  // Endpoint para obtener todos los usuarios por rol
  @Get('user/role/:role')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByRole(paginationDto, role);
  }

  // Endpoint para obtener todos los usuarios por estado  
  @Get('user/status/:status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByStatus(@Param('status') status: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByStatus(paginationDto, status);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @Get('user/taxpayer/:taxpayer')
  async findOneTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.usersService.findOneTaxpayer(taxpayer);
  }

  // Endpoint para obtener un usuario por numero de licencia profesional
  @Get('user/license/:license')
  async findOneLicense(@Param('license') license: string) {
    return this.usersService.findOneLicense(license);
  }

  // Endpoint para obtener un usuario por id
  @Get('user/id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // Endpoint para actualizar un usuario
  @Patch('user/id/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @Delete('user/id/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
  
}
