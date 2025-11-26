import { Module } from '@nestjs/common';

import { S3Module } from '@app/s3/s3.module';

import { FileUploadService } from './file-upload.service';

@Module({
  imports: [S3Module],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
