import { Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from '../utils/shared/shared.module';

@Module({
  imports: [
    PrismaModule, 
    SharedModule
  ],
  controllers: [TransportersController,],
  providers: [TransportersService],
  exports:[TransportersService]
})
export class TransportersModule {}
