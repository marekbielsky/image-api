import { Injectable, NotFoundException } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { ImagesMapper } from './images.mapper';
import { ImageResponseDto } from './responses';
import { CreateImageDto } from './dtos';

@Injectable()
export class ImagesService {
  public constructor(private readonly imageRepository: ImagesRepository) {}

  public async create(data: CreateImageDto): Promise<ImageResponseDto> {
    const entity = await this.imageRepository.create(data);
    return ImagesMapper.toResponseDto(entity);
  }

  public async findAll(): Promise<ImageResponseDto[]> {
    const entities = await this.imageRepository.findAll();
    return ImagesMapper.toResponseDtoList(entities);
  }

  public async findOne(id: string): Promise<ImageResponseDto> {
    const entity = await this.imageRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Image with id "${id}" not found.`);
    }

    return ImagesMapper.toResponseDto(entity);
  }

  public async remove(id: string): Promise<void> {
    await this.imageRepository.deleteById(id);
  }
}
