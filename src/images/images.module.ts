import { Module } from '@nestjs/common';

import { S3Module } from '@app/s3/s3.module';

import { ImagesController } from './controllers/images.controller';
import { ImagesRepository } from './repositories/images.repository';
import { ImagesService } from './services/images.service';
import { DefaultEncodingStrategy } from './strategies/default-encoding.strategy';
import { GifEncodingStrategy } from './strategies/gif-encoding.strategy';
import { JpegEncodingStrategy } from './strategies/jpeg-encoding.strategy';
import { PngEncodingStrategy } from './strategies/png-encoding.strategy';
import { WebpEncodingStrategy } from './strategies/webp-encoding.strategy';

@Module({
  imports: [S3Module],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    ImagesRepository,
    JpegEncodingStrategy,
    PngEncodingStrategy,
    WebpEncodingStrategy,
    GifEncodingStrategy,
    DefaultEncodingStrategy,
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
