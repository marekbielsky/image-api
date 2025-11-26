import { Image } from '@prisma/client';
import { ImageResponseDto } from './responses';

export class ImagesMapper {
  public static toResponseDto(entity: Image): ImageResponseDto {
    return new ImageResponseDto(entity);
  }

  public static toResponseDtoList(entities: Image[]): ImageResponseDto[] {
    return entities.map(ImagesMapper.toResponseDto);
  }
}
