import sharp from 'sharp';

import { WebpEncodingStrategy } from '../webp-encoding.strategy';

describe('WebpEncodingStrategy', () => {
  let strategy: WebpEncodingStrategy;

  beforeEach(() => {
    strategy = new WebpEncodingStrategy();
  });

  it('should support image/webp MIME type only', () => {
    expect(strategy.supports('image/webp')).toBe(true);
    expect(strategy.supports('image/jpeg')).toBe(false);
    expect(strategy.supports('image/png')).toBe(false);
  });

  it('should encode an image buffer into WebP format', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 20,
        height: 20,
        channels: 3,
        background: { r: 0, g: 255, b: 0 },
      },
    })
      .jpeg()
      .toBuffer();

    const image = sharp(inputBuffer);
    const { buffer, contentType } = await strategy.encode(image, 'image/webp');

    expect(contentType).toBe('image/webp');
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const meta = await sharp(buffer).metadata();

    expect(meta.format).toBe('webp');
    expect(meta.width).toBe(20);
    expect(meta.height).toBe(20);

    expect(buffer.length).toBeLessThan(inputBuffer.length);
  });
});
