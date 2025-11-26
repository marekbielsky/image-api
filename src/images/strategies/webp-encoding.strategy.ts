import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ImageEncodingResult, ImageEncodingStrategy } from './types';

@Injectable()
export class WebpEncodingStrategy implements ImageEncodingStrategy {
  public supports(mimeType: string): boolean {
    return mimeType === 'image/webp';
  }

  public async encode(image: sharp.Sharp, _originalMime: string): Promise<ImageEncodingResult> {
    const buffer = await image
      .webp({
        quality: 80,
      })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/webp',
    };
  }
}
