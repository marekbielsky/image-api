import { Test } from '@nestjs/testing';
import { Image } from '@prisma/client';

import { ImagesMockFactory } from '@app/images/mocks/images-mock.factory';
import { PrismaModule } from '@app/prisma/prisma.module';
import { PrismaService } from '@app/prisma/prisma.service';

import { ImagesRepository } from './images.repository';
import { CreateImageEntityProps, FindImagesParams } from './types';

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
      const params: FindImagesParams = {
        title: undefined,
        page: 2,
        limit: 5,
      };

      const mockImageEntity = ImagesMockFactory.getMockEntity();
      const mockImageEntities = [mockImageEntity];

      jest.spyOn(prismaService.image, 'findMany').mockResolvedValue(mockImageEntities);

      const result = await imagesRepository.findMany(params);

      expect(prismaService.image.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });

      expect(result).toEqual(mockImageEntities);
    });

    it('should query images with title filter and pagination', async () => {
      const params: FindImagesParams = {
        title: 'sun',
        page: 1,
        limit: 10,
      };

      const mockImageEntities: Image[] = [];

      jest.spyOn(prismaService.image, 'findMany').mockResolvedValue(mockImageEntities);

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

      expect(result).toEqual(mockImageEntities);
    });
  });

  describe('findById', () => {
    it('should return image when found', async () => {
      const mockImageEntity = ImagesMockFactory.getMockEntity({
        id: '123',
        title: 'Found',
        url: 'https://example.com/found.jpg',
      });

      jest.spyOn(prismaService.image, 'findUnique').mockResolvedValue(mockImageEntity);

      const result = await imagesRepository.findById('123');

      expect(prismaService.image.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockImageEntity);
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
