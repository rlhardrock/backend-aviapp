import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  constructor() {
    //  Aquí lo solucionamos tipando correctamente:
    super();
    (this as any).$on('beforeExit', async () => {
      console.log('Prisma client beforeExit hook');
    });
  }
}
