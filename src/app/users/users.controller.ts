import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../utils/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @Post('userRegister')
  /* @UseGuards(AuthGuard('jwt')) */
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @Get('userList')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query.page, query.limit);
  }

  // Endpoint para obtener todos los usuarios por rol
  @Get('userRole/:role')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByRole(@Param('role') role: string, @Query() query: PaginationDto) {
    return this.usersService.findAllByRole(role, query.page, query.limit);
  }

  // Endpoint para obtener todos los usuarios por estado  
  @Get('userStatus/:status')
  @UsePipes(new ValidationPipe({ transform: true }))
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByStatus(@Param('status') status: string, @Query() query: PaginationDto) {
    return this.usersService.findAllByStatus(status, query.page, query.limit);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @Get('user/:taxpayer')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTaxpayer(@Param('taxpayer') taxpayer: string) {
    return this.usersService.findOneTaxpayer(taxpayer);
  }

  // Endpoint para obtener un usuario por numero de licencia profesional
  @Get('user/:license')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneLicense(@Param('license') license: string) {
    return this.usersService.findOneLicense(license);
  }

  // Endpoint para obtener un usuario por id
  @Get('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Endpoint para actualizar un usuario
  @Patch('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @Delete('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  
}
