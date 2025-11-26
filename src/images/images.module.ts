import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './images.repository';
import { S3Module } from '@app/s3/s3.module';
import { FileUploadModule } from '@app/file-upload/file-upload.module';

@Module({
  imports: [S3Module, FileUploadModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesService],
})
export class ImagesModule {}
