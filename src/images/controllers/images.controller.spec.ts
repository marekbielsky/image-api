import { Test } from '@nestjs/testing';

import { CreateImageDto } from '../dtos';
import { ImagesMockFactory } from '../mocks/images-mock.factory';
import { ImagesService } from '../services/images.service';

import { ImagesController } from './images.controller';

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imagesService: jest.Mocked<ImagesService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService],
    })
      .overrideProvider(ImagesService)
      .useValue({
        create: jest.fn(),
        findMany: jest.fn(),
        findOne: jest.fn(),
      })
      .compile();

    imagesController = moduleRef.get<ImagesController>(ImagesController);
    imagesService = moduleRef.get(ImagesService) as jest.Mocked<ImagesService>;
  });

  it('should delegate to imagesService.create and return result', async () => {
    const file = {
      buffer: Buffer.from('test'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    const dto = new CreateImageDto('Test Image', 800, 600);

    const mockResponse = ImagesMockFactory.getMockImageResponseDto({
      id: 'img-1',
      title: dto.title,
      url: 'https://example.com/img.jpg',
      width: dto.width,
      height: dto.height,
    });

    imagesService.create.mockResolvedValueOnce(mockResponse);

    const result = await imagesController.create(file, dto);

    expect(imagesService.create).toHaveBeenCalledWith(file, dto);
    expect(result).toEqual(mockResponse);
  });
});
