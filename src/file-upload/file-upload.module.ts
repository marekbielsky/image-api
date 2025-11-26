import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { S3Module } from '@app/s3/s3.module';

@Module({
  imports: [S3Module],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
