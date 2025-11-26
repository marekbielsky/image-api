import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ImageEncodingResult, ImageEncodingStrategy } from './types';

@Injectable()
export class PngEncodingStrategy implements ImageEncodingStrategy {
  public supports(mimeType: string): boolean {
    return mimeType === 'image/png';
  }

  public async encode(image: sharp.Sharp, _originalMime: string): Promise<ImageEncodingResult> {
    const buffer = await image
      .png({
        compressionLevel: 9,
        palette: true,
      })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/png',
    };
  }
}
