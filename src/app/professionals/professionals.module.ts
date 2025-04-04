import { Module } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from '../utils/shared/shared.module';

@Module({
  imports: [
    PrismaModule,
    SharedModule
  ],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService]
})
export class ProfessionalsModule {}
