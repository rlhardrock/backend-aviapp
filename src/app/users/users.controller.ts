import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  /* @UseGuards(AuthGuard('jwt')) */
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  // Endpoint para obtener todos los usuarios por rol
  @Get('userRole/:role')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByRole(@Param('role') role: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAllByRole(role, page, limit);
  }

  // Endpoint para obtener todos los usuarios por estado
  @Get('userStatus/:status')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByStatus(@Param('status') status: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAllByStatus(status, page, limit);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @Get('user/:taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTaxpayer(@Param('taxpayerId') taxpayerId: string) {
    return this.usersService.findOneTaxpayerId(taxpayerId);
  }

  // Endpoint para obtener un usuario por id
  @Get('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneId(@Param('id') id: number) {
    return this.usersService.findOneId(id);
  }

  // Endpoint para actualizar un usuario
  @Patch('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @Delete('user/:id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
  
}
