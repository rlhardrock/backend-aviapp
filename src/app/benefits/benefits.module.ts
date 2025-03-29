import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsService } from '../utils/utils.service';
import { BenefitsFormulasService } from './benefits-formulas.service';

@Module({
  imports: [
    PrismaModule, 
    UtilsService,
    BenefitsFormulasService
  ],
  controllers: [BenefitsController],
  providers: [BenefitsService],
})
export class BenefitsModule {}
