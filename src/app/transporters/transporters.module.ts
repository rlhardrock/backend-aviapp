import { Module } from '@nestjs/common';
import { TransportersService } from './transporters.service';
import { TransportersController } from './transporters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [
    PrismaModule, 
    UtilsService
  ],
  controllers: [TransportersController],
  providers: [TransportersService],
})
export class TransportersModule {}
