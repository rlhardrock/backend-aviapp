import { Injectable } from '@nestjs/common';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class BenefitsService {

  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}
 
  // Crear un nuevo benefit
  create(createBenefitDto: CreateBenefitDto) {
    return 'This action adds a new benefit';
  }

  findAll() {
    return `This action returns all benefits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} benefit`;
  }

  update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return `This action updates a #${id} benefit`;
  }

  remove(id: number) {
    return `This action removes a #${id} benefit`;
  }
}
