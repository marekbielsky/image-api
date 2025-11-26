import { Injectable, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';
import { CreateImageEntityProps, ImagesRepository } from './images.repository';
import { CreateImageDto } from './dtos';
import { ImageResponseDto } from './responses';
import { ImagesMapper } from './images.mapper';
import { FileUploadService } from '@app/file-upload/file-upload.service';

@Injectable()
export class ImagesService {
  public constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly imagesRepository: ImagesRepository,
  ) {}

  public async create(file: Express.Multer.File, dto: CreateImageDto): Promise<ImageResponseDto> {
    const resizedBuffer = await sharp(file.buffer).resize(dto.width, dto.height).toBuffer();

    const uploadResult = await this.fileUploadService.uploadImageFromBuffer({
      fileBuffer: resizedBuffer,
      contentType: file.mimetype,
      keyPrefix: 'images',
    });

    const createProps: CreateImageEntityProps = {
      title: dto.title,
      url: uploadResult.url,
      width: dto.width,
      height: dto.height,
    };

    const entity = await this.imagesRepository.create(createProps);
    return ImagesMapper.toResponseDto(entity);
  }

  public async findAll(): Promise<ImageResponseDto[]> {
    const entities = await this.imagesRepository.findAll();
    return ImagesMapper.toResponseDtoList(entities);
  }

  public async findOne(id: string): Promise<ImageResponseDto> {
    const entity = await this.imagesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Image with id "${id}" not found.`);
    }

    return ImagesMapper.toResponseDto(entity);
  }

  public async remove(id: string): Promise<void> {
    await this.imagesRepository.deleteById(id);
  }
}
