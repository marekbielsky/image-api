import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { HealthModule } from '@app/health/health.module';

@Module({
  imports: [PrismaModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
