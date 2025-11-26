import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Controller } from './controllers/s3.controller';
import { S3Service } from './services/s3.service';

@Module({
  controllers: [S3Controller],
  providers: [
    {
      provide: S3Client,
      useFactory: () =>
        new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
          },
          endpoint: process.env.AWS_ENDPOINT,
          forcePathStyle: process.env.AWS_FORCE_PATH_STYLE === 'true',
        }),
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
