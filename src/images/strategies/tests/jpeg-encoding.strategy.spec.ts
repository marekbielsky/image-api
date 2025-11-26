import sharp from 'sharp';

import { JpegEncodingStrategy } from '../jpeg-encoding.strategy';

describe('JpegEncodingStrategy', () => {
  let strategy: JpegEncodingStrategy;

  beforeEach(() => {
    strategy = new JpegEncodingStrategy();
  });

  it('should support image/jpeg and image/jpg', () => {
    expect(strategy.supports('image/jpeg')).toBe(true);
    expect(strategy.supports('image/jpg')).toBe(true);
    expect(strategy.supports('image/png')).toBe(false);
  });

  it('should encode a JPEG image and return correct contentType', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const image = sharp(inputBuffer);
    const { buffer, contentType } = await strategy.encode(image, 'image/jpeg');

    expect(contentType).toBe('image/jpeg');
    expect(Buffer.isBuffer(buffer)).toBe(true);

    const meta = await sharp(buffer).metadata();

    expect(meta.format).toBe('jpeg');
    expect(meta.width).toBe(10);
    expect(meta.height).toBe(10);
  });
});
