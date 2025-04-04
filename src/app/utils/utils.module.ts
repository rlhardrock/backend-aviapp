import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  providers: [UtilsService],   // Registras el servicio
  exports: [UtilsService],     // Lo haces disponible para otros módulos
})
export class UtilsModule {}
