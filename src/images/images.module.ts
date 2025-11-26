import { Module } from '@nestjs/common';

import { FileUploadModule } from '@app/file-upload/file-upload.module';

import { ImagesController } from './images.controller';
import { ImagesRepository } from './images.repository';
import { ImagesService } from './images.service';

@Module({
  imports: [FileUploadModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesService],
})
export class ImagesModule {}
