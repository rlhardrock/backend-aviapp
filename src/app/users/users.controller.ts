import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @Post()
  /* @UseGuards(AuthGuard('jwt')) */
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @Get()
  /* @UseGuards(AuthGuard('jwt')) */
  findAll() {
    return this.usersService.findAll();
  }

  // Endpoint para obtener todos los usuarios por rol
  @Get('role/:role')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByRole(@Param('role') role: string) {
    return this.usersService.findAllByRole(role);
  }

  // Endpoint para obtener todos los usuarios por estado
  @Get('status/:status')
  /* @UseGuards(AuthGuard('jwt')) */
  findAllByStatus(@Param('status') status: string) {
    return this.usersService.findAllByStatus(status);
  }
 
  // Endpoint para obtener un usuario por numero de identificacion
  @Get(':taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneTaxpayer(@Param('taxpayerId') taxpayerId: string) {
    return this.usersService.findOneTaxpayerId(taxpayerId);
  }

  // Endpoint para obtener un usuario por id
  @Get(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  findOneId(@Param('id') id: number) {
    return this.usersService.findOneId(id);
  }

  // Endpoint para actualizar un usuario
  @Patch(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  
  // Endpoint para eliminar un usuario
  @Delete(':id')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
  
}
