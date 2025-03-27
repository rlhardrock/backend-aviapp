import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { CreateTransporterDto } from './dto/create-transporter.dto';
import { UpdateTransporterDto } from './dto/update-transporter.dto';

@Controller('transporters')
export class TransportersController {
  constructor(private readonly transportersService: TransportersService) {}

  @Post()
  create(@Body() createTransporterDto: CreateTransporterDto) {
    return this.transportersService.create(createTransporterDto);
  }

  @Get()
  findAll() {
    return this.transportersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransporterDto: UpdateTransporterDto) {
    return this.transportersService.update(+id, updateTransporterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportersService.remove(+id);
  }
}
