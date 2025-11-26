import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { ImageEncodingResult, ImageEncodingStrategy } from './types';

@Injectable()
export class DefaultEncodingStrategy implements ImageEncodingStrategy {
  public supports(_mimeType: string): boolean {
    return true;
  }

  public async encode(image: sharp.Sharp, originalMime: string): Promise<ImageEncodingResult> {
    const buffer = await image.toBuffer();

    return {
      buffer,
      contentType: originalMime || 'application/octet-stream',
    };
  }
}
