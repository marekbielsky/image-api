import { Module } from '@nestjs/common';

import { S3Module } from '@app/s3/s3.module';

import { ImagesController } from './controllers/images.controller';
import { ImagesRepository } from './repositories/images.repository';
import { ImagesService } from './services/images.service';

@Module({
  imports: [S3Module],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesService],
})
export class ImagesModule {}
