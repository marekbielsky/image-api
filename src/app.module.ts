import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { HealthModule } from '@app/health/health.module';
import { S3Module } from '@app/s3/s3.module';
import { ImagesModule } from './images/images.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [PrismaModule, HealthModule, S3Module, ImagesModule, FileUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
