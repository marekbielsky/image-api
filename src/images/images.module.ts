import { Module } from '@nestjs/common';

import { ImagesController } from './controllers/images.controller';
import { ImagesRepository } from './repositories/images.repository';
import { ImagesService } from './services/images.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesService],
})
export class ImagesModule {}
