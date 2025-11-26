import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Image } from '@prisma/client';
import { ImagesRepository } from '@app/images/images.repository';
import { CreateImageDto, GetImagesQueryDto } from './dtos';
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
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: ImagesRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            uploadImageFromBuffer: jest.fn(),
          },
        },
      ],
    }).compile();

    imagesService = moduleRef.get(ImagesService);
    imagesRepository = moduleRef.get(ImagesRepository);
    fileUploadService = moduleRef.get(FileUploadService);
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

      (fileUploadService.uploadImageFromBuffer as jest.Mock).mockResolvedValue({
        key: 'images/test-key',
        url: 'https://bucket.s3.region.amazonaws.com/images/test-key',
        bucket: 'bucket',
      });

      const createdAt = new Date('2025-01-01T00:00:00.000Z');
      const updatedAt = new Date('2025-01-01T00:00:00.000Z');

      const entity: Image = {
        id: 'image-id',
        title: dto.title,
        url: 'https://bucket.s3.region.amazonaws.com/images/test-key',
        width: dto.width,
        height: dto.height,
        createdAt,
        updatedAt,
      };

      (imagesRepository.create as jest.Mock).mockResolvedValue(entity);

      const result = await imagesService.create(file, dto);

      expect(fileUploadService.uploadImageFromBuffer).toHaveBeenCalledWith(
        expect.objectContaining({
          contentType: file.mimetype,
          keyPrefix: 'images',
        }),
      );

      expect(imagesRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        url: entity.url,
        width: dto.width,
        height: dto.height,
      });

      expect(result).toEqual({
        id: 'image-id',
        title: dto.title,
        url: entity.url,
        width: dto.width,
        height: dto.height,
        createdAt,
        updatedAt,
      } satisfies ImageResponseProps);
    });
  });

  describe('findMany', () => {
    it('should use default pagination when no page/limit provided', async () => {
      const query = new GetImagesQueryDto(); // no values set

      const imageEntities: Image[] = [
        {
          id: '1',
          title: 'First',
          url: 'https://example.com/1.jpg',
          width: 800,
          height: 600,
          createdAt: new Date('2025-01-01T00:00:00.000Z'),
          updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
      ];

      (imagesRepository.findMany as jest.Mock).mockResolvedValue(imageEntities);

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

      const imageEntities: Image[] = [
        {
          id: '2',
          title: 'Funny cat',
          url: 'https://example.com/2.jpg',
          width: 800,
          height: 600,
          createdAt: new Date('2025-01-01T00:00:00.000Z'),
          updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
      ];

      (imagesRepository.findMany as jest.Mock).mockResolvedValue(imageEntities);

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
      const entity: Image = {
        id: '123',
        title: 'Test',
        url: 'https://example.com/img.jpg',
        width: 800,
        height: 600,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T00:00:00.000Z'),
      };

      (imagesRepository.findById as jest.Mock).mockResolvedValue(entity);

      const result = await imagesService.findOne('123');

      expect(imagesRepository.findById).toHaveBeenCalledWith('123');
      expect(result.id).toBe('123');
      expect(result.title).toBe('Test');
    });

    it('should throw NotFoundException when image does not exist', async () => {
      (imagesRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(imagesService.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delegate deletion to repository', async () => {
      (imagesRepository.deleteById as jest.Mock).mockResolvedValue(undefined);

      await imagesService.remove('to-delete');

      expect(imagesRepository.deleteById).toHaveBeenCalledWith('to-delete');
    });
  });
});
