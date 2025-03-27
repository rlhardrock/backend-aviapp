import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  /* @UseGuards(AuthGuard('jwt')) */
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  /* @UseGuards(AuthGuard('jwt')) */
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  findOne(@Param('taxpayerId') taxpayerId: string) {
    return this.usersService.findOne(taxpayerId);
  }

  @Patch(':taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  update(
    @Param('taxpayerId') taxpayerId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(Number(taxpayerId), updateUserDto);
  }

  @Delete(':taxpayerId')
  /* @UseGuards(AuthGuard('jwt')) */
  remove(@Param('taxpayerId') taxpayerId: string) {
    return this.usersService.remove(Number(taxpayerId));
  }
}
