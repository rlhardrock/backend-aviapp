import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super(); // Hook moderno compatible con Prisma 5+
    process.on('beforeExit', async () => {
      try {
        this.logger.log('⚠️ La Aplicación se esta apagando ...Limpiando las conecciones de Prisma5.');
        await this.$disconnect();
        this.logger.log('✅ Prisma5 desconectado exitosamente.');
      } catch (error) {
        this.logger.error('❌ Error mientras Prisma5 se esta desconectando', error);
      }
    });
  };
  
  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Prisma conectado.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🧹 Prisma desconectado.');
  }
 
}
