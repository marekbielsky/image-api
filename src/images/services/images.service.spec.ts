import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { S3Module } from '@app/s3/s3.module';
import { S3Service } from '@app/s3/services/s3.service';

import { CreateImageDto, GetImagesQueryDto } from '../dtos';
import { ImagesMockFactory } from '../mocks/images-mock.factory';
import { ImagesRepository } from '../repositories/images.repository';
import { ImageResponseProps } from '../responses';
import { DefaultEncodingStrategy } from '../strategies/default-encoding.strategy';
import { GifEncodingStrategy } from '../strategies/gif-encoding.strategy';
import { JpegEncodingStrategy } from '../strategies/jpeg-encoding.strategy';
import { PngEncodingStrategy } from '../strategies/png-encoding.strategy';
import { WebpEncodingStrategy } from '../strategies/webp-encoding.strategy';

import { ImagesService } from './images.service';

jest.mock('sharp', () => {
  const sharpMock = jest.fn(() => ({
    rotate: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    gif: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('resized-buffer')),
  }));

  return { __esModule: true, default: sharpMock };
});

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let imagesRepository: jest.Mocked<ImagesRepository>;
  let s3Service: jest.Mocked<S3Service>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [S3Module],
      providers: [
        JpegEncodingStrategy,
        PngEncodingStrategy,
        WebpEncodingStrategy,
        GifEncodingStrategy,
        DefaultEncodingStrategy,
        ImagesService,
        ImagesRepository,
      ],
    })
      .overrideProvider(ImagesRepository)
      .useValue({
        create: jest.fn(),
        findMany: jest.fn(),
        findById: jest.fn(),
      })
      .overrideProvider(S3Service)
      .useValue({
        uploadObject: jest.fn(),
      })
      .compile();

    imagesService = moduleRef.get(ImagesService);
    imagesRepository = moduleRef.get(ImagesRepository) as jest.Mocked<ImagesRepository>;
    s3Service = moduleRef.get(S3Service) as jest.Mocked<S3Service>;
  });

  describe('create', () => {
    it('should resize, upload and persist an image', async () => {
      const file = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const dto = new CreateImageDto({ title: 'Test Image', width: 800, height: 600 });

      s3Service.uploadObject.mockResolvedValue({
        key: 'images/test-key',
        url: 'https://bucket.s3.region.amazonaws.com/images/test-key',
        bucket: 'bucket',
      });

      const createdAt = new Date('2025-01-01T00:00:00.000Z');
      const updatedAt = new Date('2025-01-01T00:00:00.000Z');

      const mockImageEntity = ImagesMockFactory.getMockEntity({
        id: 'image-id',
        title: dto.title,
        url: 'https://bucket.s3.region.amazonaws.com/images/test-key',
        width: dto.width,
        height: dto.height,
        createdAt,
        updatedAt,
      });

      imagesRepository.create.mockResolvedValue(mockImageEntity);

      const result = await imagesService.create(file, dto);

      expect(s3Service.uploadObject).toHaveBeenCalledWith(
        expect.objectContaining({
          contentType: file.mimetype,
          keyPrefix: 'images',
        }),
      );

      expect(imagesRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        url: mockImageEntity.url,
        width: dto.width,
        height: dto.height,
      });

      expect(result).toEqual({
        id: 'image-id',
        title: dto.title,
        url: mockImageEntity.url,
        width: dto.width,
        height: dto.height,
        createdAt,
        updatedAt,
      } satisfies ImageResponseProps);
    });
  });

  describe('findMany', () => {
    it('should use default pagination when no page/limit provided', async () => {
      const query = new GetImagesQueryDto({});
      const mockImageEntity = ImagesMockFactory.getMockEntity();
      const mockImageEntities = [mockImageEntity];

      imagesRepository.findMany.mockResolvedValue(mockImageEntities);

      const result = await imagesService.findMany(query);

      expect(imagesRepository.findMany).toHaveBeenCalledWith({
        title: undefined,
        page: 1,
        limit: 10,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('First');
    });

    it('should pass title filter and pagination to repository', async () => {
      const query = new GetImagesQueryDto({ title: 'cat', page: 2, limit: 5 });

      const mockImageEntity = ImagesMockFactory.getMockEntity({
        id: '2',
        title: 'Funny cat',
        url: 'https://example.com/2.jpg',
      });

      imagesRepository.findMany.mockResolvedValue([mockImageEntity]);

      const result = await imagesService.findMany(query);

      expect(imagesRepository.findMany).toHaveBeenCalledWith({
        title: 'cat',
        page: 2,
        limit: 5,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
      expect(result[0].title).toBe('Funny cat');
    });
  });

  describe('findOne', () => {
    it('should return mapped image when found', async () => {
      const mockImageEntity = ImagesMockFactory.getMockEntity({
        id: '123',
        title: 'Test',
        url: 'https://example.com/img.jpg',
      });

      imagesRepository.findById.mockResolvedValue(mockImageEntity);

      const result = await imagesService.findOne('123');

      expect(imagesRepository.findById).toHaveBeenCalledWith('123');
      expect(result.id).toBe('123');
      expect(result.title).toBe('Test');
    });

    it('should throw NotFoundException when image does not exist', async () => {
      imagesRepository.findById.mockResolvedValue(null);

      await expect(imagesService.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
