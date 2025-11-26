import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ImageEncodingResult, ImageEncodingStrategy } from './types';

@Injectable()
export class GifEncodingStrategy implements ImageEncodingStrategy {
  public supports(mimeType: string): boolean {
    return mimeType === 'image/gif';
  }

  public async encode(image: sharp.Sharp, _originalMime: string): Promise<ImageEncodingResult> {
    const buffer = await image
      .gif({
        effort: 3,
      })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/gif',
    };
  }
}
