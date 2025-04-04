import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BenefitsFormulasService } from './benefits-formulas.service';
import { SharedModule } from '../utils/shared/shared.module';

@Module({
  imports: [
    PrismaModule, 
    SharedModule
  ],
  controllers: [BenefitsController],
  providers: [BenefitsService, BenefitsFormulasService],
  exports: [BenefitsService, BenefitsFormulasService]
})
export class BenefitsModule {}
