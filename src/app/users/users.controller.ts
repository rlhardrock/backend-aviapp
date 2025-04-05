import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @Post('user/register')
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @Get('user/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  // Endpoint para obtener todos los usuarios por rol
  @Get('user/role/:role')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByRole(@Param('role') role: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByRole(paginationDto, role);
  }

  // Endpoint para obtener todos los usuarios por estado  
  @Get('user/status/:status')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByStatus(@Param('status') status: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAllByStatus(paginationDto, status);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @Get('user/taxpayer/:taxpayer')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.usersService.findOneTaxpayer(taxpayer);
  }

  // Endpoint para obtener un usuario por numero de licencia profesional
  @Get('user/license/:license')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneLicense(@Param('license') license: string) {
    return this.usersService.findOneLicense(license);
  }

  // Endpoint para obtener un usuario por id
  @Get('user/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // Endpoint para actualizar un usuario
  @Patch('user/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @Delete('user/id/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
  
}
