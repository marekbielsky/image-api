import { Module } from '@nestjs/common';

import { HealthModule } from '@app/health/health.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { S3Module } from '@app/s3/s3.module';

import { FileUploadModule } from './file-upload/file-upload.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [PrismaModule, HealthModule, S3Module, ImagesModule, FileUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
