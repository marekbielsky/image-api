import sharp from 'sharp';

import { PngEncodingStrategy } from '../png-encoding.strategy';

describe('PngEncodingStrategy', () => {
  let strategy: PngEncodingStrategy;

  beforeEach(() => {
    strategy = new PngEncodingStrategy();
  });

  it('should support image/png MIME type only', () => {
    expect(strategy.supports('image/png')).toBe(true);
    expect(strategy.supports('image/jpeg')).toBe(false);
    expect(strategy.supports('image/webp')).toBe(false);
  });

  it('should encode an image buffer into PNG format', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 0, g: 0, b: 255 },
      },
    })
      .jpeg()
      .toBuffer();

    const image = sharp(inputBuffer);
    const { buffer, contentType } = await strategy.encode(image, 'image/png');

    expect(contentType).toBe('image/png');
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const meta = await sharp(buffer).metadata();

    expect(meta.format).toBe('png');
    expect(meta.width).toBe(10);
    expect(meta.height).toBe(10);
  });
});
