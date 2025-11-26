import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ImagesRepository } from '@app/images/images.repository';
import { PrismaModule } from '@app/prisma/prisma.module';
import { S3Module } from '@app/s3/s3.module';
import { S3Service } from '@app/s3/s3.service';

import { ImagesMockFactory } from './mocks/images-mock.factory';
import { CreateImageDto, GetImagesQueryDto } from './dtos';
import { ImagesService } from './images.service';
import { ImageResponseProps } from './responses';

jest.mock('sharp', () => {
  const sharpMock = jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('resized-buffer')),
  }));

  return {
    __esModule: true,
    default: sharpMock,
  };
});

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let imagesRepository: ImagesRepository;
  let s3Service: S3Service;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, S3Module],
      providers: [ImagesService, ImagesRepository],
    }).compile();

    imagesService = moduleRef.get<ImagesService>(ImagesService);
    imagesRepository = moduleRef.get<ImagesRepository>(ImagesRepository);
    s3Service = moduleRef.get<S3Service>(S3Service);
  });

  describe('create', () => {
    it('should resize, upload and persist an image', async () => {
      const file = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const title = 'Test Image';
      const width = 800;
      const height = 600;

      const dto = new CreateImageDto(title, width, height);

      jest.spyOn(s3Service, 'uploadObject').mockResolvedValue({
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

      jest.spyOn(imagesRepository, 'create').mockResolvedValue(mockImageEntity);

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
      const query = new GetImagesQueryDto();

      const mockImageEntity = ImagesMockFactory.getMockEntity();
      const mockImageEntities = [mockImageEntity];

      jest.spyOn(imagesRepository, 'findMany').mockResolvedValue(mockImageEntities);

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
      const query = new GetImagesQueryDto();
      query.title = 'cat';
      query.page = 2;
      query.limit = 5;

      const mockImageEntity = ImagesMockFactory.getMockEntity({
        id: '2',
        title: 'Funny cat',
        url: 'https://example.com/2.jpg',
      });

      const mockImageEntities = [mockImageEntity];

      jest.spyOn(imagesRepository, 'findMany').mockResolvedValue(mockImageEntities);

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

      jest.spyOn(imagesRepository, 'findById').mockResolvedValue(mockImageEntity);

      const result = await imagesService.findOne('123');

      expect(imagesRepository.findById).toHaveBeenCalledWith('123');
      expect(result.id).toBe('123');
      expect(result.title).toBe('Test');
    });

    it('should throw NotFoundException when image does not exist', async () => {
      jest.spyOn(imagesRepository, 'findById').mockResolvedValue(null);

      await expect(imagesService.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
