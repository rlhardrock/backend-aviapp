import { Module } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from '../utils/shared/shared.module';

@Module({
  imports: [
    PrismaModule,
    SharedModule
  ],
  controllers: [TrucksController, ],
  providers: [TrucksService],
  exports: [TrucksService]
})
export class TrucksModule {}
