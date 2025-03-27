import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [
    PrismaModule, 
    UtilsService
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
