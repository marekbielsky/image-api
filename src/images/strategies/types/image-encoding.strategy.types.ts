import type sharp from 'sharp';

export interface ImageEncodingResult {
  buffer: Buffer;
  contentType: string;
}

export interface ImageEncodingStrategy {
  supports(mimeType: string): boolean;
  encode(image: sharp.Sharp, originalMime: string): Promise<ImageEncodingResult>;
}
