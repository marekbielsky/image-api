import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ImageEncodingResult, ImageEncodingStrategy } from './types';

@Injectable()
export class JpegEncodingStrategy implements ImageEncodingStrategy {
  public supports(mimeType: string): boolean {
    return mimeType === 'image/jpeg' || mimeType === 'image/jpg';
  }

  public async encode(image: sharp.Sharp, _originalMime: string): Promise<ImageEncodingResult> {
    const buffer = await image
      .jpeg({
        quality: 80,
        chromaSubsampling: '4:2:0',
        mozjpeg: true,
      })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/jpeg',
    };
  }
}
