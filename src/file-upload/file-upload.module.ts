import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
