import sharp from 'sharp';

import { GifEncodingStrategy } from '../gif-encoding.strategy';

describe('GifEncodingStrategy', () => {
  let strategy: GifEncodingStrategy;

  beforeEach(() => {
    strategy = new GifEncodingStrategy();
  });

  it('should support image/gif MIME type only', () => {
    expect(strategy.supports('image/gif')).toBe(true);
    expect(strategy.supports('image/jpeg')).toBe(false);
    expect(strategy.supports('image/png')).toBe(false);
  });

  it('should encode an image buffer into GIF format', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 15,
        height: 15,
        channels: 3,
        background: { r: 255, g: 255, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const image = sharp(inputBuffer);
    const { buffer, contentType } = await strategy.encode(image, 'image/gif');

    expect(contentType).toBe('image/gif');
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const meta = await sharp(buffer).metadata();

    expect(meta.format).toBe('gif');
    expect(meta.width).toBe(15);
    expect(meta.height).toBe(15);
  });
});
