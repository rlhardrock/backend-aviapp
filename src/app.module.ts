import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { BenefitsModule } from './app/benefits/benefits.module';
import { CompaniesModule } from './app/companies/companies.module';
import { TransportersModule } from './app/transporters/transporters.module';
import { ProfessionalsModule } from './app/professionals/professionals.module';
import { TrucksModule } from './app/trucks/trucks.module';
import { PrismaModule } from './prisma/prisma.module';
import { InspectorsModule } from './app/inspectors/inspectors.module';

@Module({
  imports: [
    UsersModule, 
    BenefitsModule, 
    CompaniesModule, 
    TransportersModule, 
    ProfessionalsModule,    
    TrucksModule, 
    PrismaModule, InspectorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
