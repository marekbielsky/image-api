import { Image } from '@prisma/client';
import { ImageResponseDto } from '../responses';

const defaultMockImageEntity: Image = {
  id: '1',
  title: 'First',
  url: 'https://example.com/1.jpg',
  width: 800,
  height: 600,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-01T00:00:00.000Z'),
};

export class ImagesMockFactory {
  public static getMockEntity(props: Partial<Image> = {}): Image {
    return {
      ...defaultMockImageEntity,
      ...props,
    };
  }

  public static getMockImageResponseDto(props: Partial<ImageResponseDto> = {}): ImageResponseDto {
    return new ImageResponseDto({ ...defaultMockImageEntity, ...props });
  }
}
