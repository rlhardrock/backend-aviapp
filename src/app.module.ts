import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './users/src/app/modules/modules.module';
import { UsersModule } from './users/users.module';
import { UsersModule } from './app/users/users.module';
import { BenefitsModule } from './app/benefits/benefits.module';
import { CompaniesModule } from './app/companies/companies.module';
import { TransportersModule } from './app/transporters/transporters.module';
import { ProfessionalsModule } from './app/professionals/professionals.module';
import { TrucksModule } from './app/trucks/trucks.module';

@Module({
  imports: [ModulesModule, UsersModule, BenefitsModule, CompaniesModule, TransportersModule, ProfessionalsModule, TrucksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
