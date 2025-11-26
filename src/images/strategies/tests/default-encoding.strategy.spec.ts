import sharp from 'sharp';

import { DefaultEncodingStrategy } from '../default-encoding.strategy';

describe('DefaultEncodingStrategy', () => {
  let strategy: DefaultEncodingStrategy;

  beforeEach(() => {
    strategy = new DefaultEncodingStrategy();
  });

  it('should support any MIME type as a fallback', () => {
    expect(strategy.supports('unknown/type')).toBe(true);
    expect(strategy.supports('image/unknown')).toBe(true);
    expect(strategy.supports('')).toBe(true);
  });

  it('should encode an image buffer into a valid default format', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 12,
        height: 12,
        channels: 3,
        background: { r: 128, g: 128, b: 128 },
      },
    })
      .png()
      .toBuffer();

    const image = sharp(inputBuffer);
    const { buffer, contentType } = await strategy.encode(image, 'image/unknown');

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(typeof contentType).toBe('string');
    expect(contentType).toMatch(/^image\//);

    const meta = await sharp(buffer).metadata();

    expect(meta.width).toBe(12);
    expect(meta.height).toBe(12);
  });
});
