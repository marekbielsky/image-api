import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma/prisma.module';
import { S3Module } from '@app/s3/s3.module';

import { CreateImageDto, GetImagesQueryDto } from '../dtos';
import { ImagesMockFactory } from '../mocks/images-mock.factory';
import { ImagesRepository } from '../repositories/images.repository';
import { ImagesService } from '../services/images.service';

import { ImagesController } from './images.controller';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, S3Module],
      controllers: [ImagesController],
      providers: [ImagesService, ImagesRepository],
    }).compile();

    imagesController = moduleRef.get<ImagesController>(ImagesController);
    imagesService = moduleRef.get<ImagesService>(ImagesService);
  });

  describe('create', () => {
    it('should delegate to imagesService.create and return result', async () => {
      const file = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const title = 'Test Image';
      const width = 800;
      const height = 600;

      const body = new CreateImageDto(title, width, height);

      const mockImageResponseDto = ImagesMockFactory.getMockImageResponseDto({
        id: 'img-1',
        title: body.title,
        url: 'https://example.com/img.jpg',
        width: body.width,
        height: body.height,
      });

      jest.spyOn(imagesService, 'create').mockResolvedValue(mockImageResponseDto);

      const result = await imagesController.create(file, body);

      expect(imagesService.create).toHaveBeenCalledWith(file, body);
      expect(result).toEqual(mockImageResponseDto);
    });
  });

  describe('findMany', () => {
    it('should delegate to imagesService.findMany and return list', async () => {
      const query = new GetImagesQueryDto();
      query.page = 2;
      query.limit = 5;
      query.title = 'cat';

      const mockImageResponseDto = ImagesMockFactory.getMockImageResponseDto({
        id: 'img-2',
        title: 'Funny cat',
        url: 'https://example.com/cat.jpg',
      });

      jest.spyOn(imagesService, 'findMany').mockResolvedValue([mockImageResponseDto]);

      const result = await imagesController.findMany(query);

      expect(imagesService.findMany).toHaveBeenCalledWith(query);
      expect(result).toEqual([mockImageResponseDto]);
    });
  });

  describe('findOne', () => {
    it('should delegate to imagesService.findOne and return result when found', async () => {
      const mockImageResponseDto = ImagesMockFactory.getMockImageResponseDto({
        id: 'img-3',
        title: 'Single image',
        url: 'https://example.com/one.jpg',
        width: 1024,
        height: 768,
      });

      jest.spyOn(imagesService, 'findOne').mockResolvedValue(mockImageResponseDto);

      const result = await imagesController.findOne('img-3');

      expect(imagesService.findOne).toHaveBeenCalledWith('img-3');
      expect(result).toEqual(mockImageResponseDto);
    });

    it('should propagate NotFoundException from imagesService', async () => {
      jest
        .spyOn(imagesService, 'findOne')
        .mockRejectedValue(new NotFoundException('Image not found'));

      await expect(imagesController.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
