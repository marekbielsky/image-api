import { Test } from '@nestjs/testing';
import { Image } from '@prisma/client';

import { PrismaModule } from '@app/prisma/prisma.module';
import { PrismaService } from '@app/prisma/prisma.service';

import { ImagesMockFactory } from '../mocks/images-mock.factory';
import { CreateImageEntityProps, FindImagesParams } from '../types';

import { ImagesRepository } from './images.repository';

describe('ImagesRepository', () => {
  let imagesRepository: ImagesRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ImagesRepository],
    }).compile();

    imagesRepository = moduleRef.get<ImagesRepository>(ImagesRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an image with given data', async () => {
      const data: CreateImageEntityProps = {
        title: 'Sunset',
        url: 'https://example.com/sunset.jpg',
        width: 1920,
        height: 1080,
      };

      const createdAt = new Date('2025-01-01T00:00:00.000Z');
      const updatedAt = createdAt;

      const imageEntity: Image = {
        id: 'image-id',
        title: data.title,
        url: data.url,
        width: data.width,
        height: data.height,
        createdAt,
        updatedAt,
      };

      jest.spyOn(prismaService.image, 'create').mockResolvedValue(imageEntity);

      const result = await imagesRepository.create(data);

      expect(prismaService.image.create).toHaveBeenCalledWith({
        data: {
          title: data.title,
          url: data.url,
          width: data.width,
          height: data.height,
        },
      });

      expect(result).toEqual(imageEntity);
    });
  });

  describe('findMany', () => {
    it('should query images without title filter using pagination', async () => {
      const params: FindImagesParams = { title: undefined, page: 2, limit: 5 };
      const mockEntity = ImagesMockFactory.getMockEntity();

      jest.spyOn(prismaService.image, 'findMany').mockResolvedValue([mockEntity]);

      const result = await imagesRepository.findMany(params);

      expect(prismaService.image.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });

      expect(result).toEqual([mockEntity]);
    });

    it('should query images with title filter and pagination', async () => {
      const params: FindImagesParams = { title: 'sun', page: 1, limit: 10 };
      const mockImages: Image[] = [];

      jest.spyOn(prismaService.image, 'findMany').mockResolvedValue(mockImages);

      const result = await imagesRepository.findMany(params);

      expect(prismaService.image.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'sun',
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual(mockImages);
    });
  });

  describe('findById', () => {
    it('should return image when found', async () => {
      const mockEntity = ImagesMockFactory.getMockEntity({
        id: '123',
        title: 'Found',
        url: 'https://example.com/found.jpg',
      });

      jest.spyOn(prismaService.image, 'findUnique').mockResolvedValue(mockEntity);

      const result = await imagesRepository.findById('123');

      expect(prismaService.image.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when image not found', async () => {
      jest.spyOn(prismaService.image, 'findUnique').mockResolvedValue(null);

      const result = await imagesRepository.findById('missing');

      expect(prismaService.image.findUnique).toHaveBeenCalledWith({
        where: { id: 'missing' },
      });
      expect(result).toBeNull();
    });
  });
});
