import { Injectable, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';

import { S3Service } from '@app/s3/services/s3.service';

import { CreateImageDto, GetImagesQueryDto } from '../dtos';
import { ImagesRepository } from '../repositories/images.repository';
import { ImageResponseDto } from '../responses';
import { DefaultEncodingStrategy } from '../strategies/default-encoding.strategy';
import { GifEncodingStrategy } from '../strategies/gif-encoding.strategy';
import { JpegEncodingStrategy } from '../strategies/jpeg-encoding.strategy';
import { PngEncodingStrategy } from '../strategies/png-encoding.strategy';
import { WebpEncodingStrategy } from '../strategies/webp-encoding.strategy';
import { FindImagesParams } from '../types';
import { ImageEncodingResult, ImageEncodingStrategy } from '../types/image-encoding.strategy.types';

@Injectable()
export class ImagesService {
  private readonly strategies: ImageEncodingStrategy[];

  public constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly s3Service: S3Service,
    private readonly jpegStrategy: JpegEncodingStrategy,
    private readonly pngStrategy: PngEncodingStrategy,
    private readonly webpStrategy: WebpEncodingStrategy,
    private readonly gifStrategy: GifEncodingStrategy,
    private readonly defaultStrategy: DefaultEncodingStrategy,
  ) {
    this.strategies = [
      this.jpegStrategy,
      this.pngStrategy,
      this.webpStrategy,
      this.gifStrategy,
      this.defaultStrategy,
    ];
  }

  public async create(file: Express.Multer.File, dto: CreateImageDto): Promise<ImageResponseDto> {
    const processed = await this.processImage(file, dto);

    const uploadResult = await this.s3Service.uploadObject({
      fileBuffer: processed.buffer,
      contentType: processed.contentType,
      keyPrefix: 'images',
    });

    const entity = await this.imagesRepository.create({
      title: dto.title,
      url: uploadResult.url,
      width: dto.width,
      height: dto.height,
    });

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

    if (!entities.length) {
      return [];
    }

    return entities.map((entity) => new ImageResponseDto(entity));
  }

  public async findOne(id: string): Promise<ImageResponseDto> {
    const entity = await this.imagesRepository.findById(id);

    if (!entity) {
      throw new NotFoundException(`Image with id "${id}" not found.`);
    }

    return new ImageResponseDto(entity);
  }

  private async processImage(
    file: Express.Multer.File,
    dto: CreateImageDto,
  ): Promise<ImageEncodingResult> {
    let image = sharp(file.buffer).rotate();

    image = image.resize(dto.width, dto.height, {
      fit: 'cover',
      position: 'attention',
    });

    const strategy =
      this.strategies.find((strategy) => strategy.supports(file.mimetype)) ??
      new DefaultEncodingStrategy();

    return strategy.encode(image, file.mimetype);
  }
}
