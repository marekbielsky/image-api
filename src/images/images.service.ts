import { Injectable, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesRepository } from './images.repository';
import { CreateImageDto, GetImagesQueryDto } from './dtos';
import { ImageResponseDto } from './responses';
import { FileUploadService } from '@app/file-upload/file-upload.service';
import { CreateImageEntityProps, FindImagesParams } from './types';

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
    return new ImageResponseDto(entity);
  }

  public async findMany(query: GetImagesQueryDto): Promise<ImageResponseDto[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: FindImagesParams = {
      title: query.title,
      page,
      limit,
    };

    const entities = await this.imagesRepository.findMany(params);
    return entities.map((entity) => new ImageResponseDto(entity));
  }

  public async findOne(id: string): Promise<ImageResponseDto> {
    const entity = await this.imagesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Image with id "${id}" not found.`);
    }

    return new ImageResponseDto(entity);
  }

  public async remove(id: string): Promise<void> {
    await this.imagesRepository.deleteById(id);
  }
}
