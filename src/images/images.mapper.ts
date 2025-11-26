import { Image } from '@prisma/client';
import { ImageResponseDto } from './responses';

export class ImagesMapper {
  public static toResponseDto(entity: Image): ImageResponseDto {
    return new ImageResponseDto(
      entity.id,
      entity.title,
      entity.url,
      entity.width,
      entity.height,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toResponseDtoList(entities: Image[]): ImageResponseDto[] {
    return entities.map(ImagesMapper.toResponseDto);
  }
}
