import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiUploadImage, ImageFile } from '@app/common';

import { CreateImageDto, GetImagesQueryDto } from '../dtos';
import { ImageResponseDto } from '../responses';
import { ImagesService } from '../services/images.service';

@ApiTags('/images')
@Controller({ path: '/images', version: '1' })
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadImage(ImageResponseDto)
  @ApiCreatedResponse({ type: ImageResponseDto })
  public async create(
    @ImageFile() file: Express.Multer.File,
    @Body() body: CreateImageDto,
  ): Promise<ImageResponseDto> {
    return this.imagesService.create(file, body);
  }

  @Get('/')
  @ApiOkResponse({ type: ImageResponseDto, isArray: true })
  public async findMany(@Query() query: GetImagesQueryDto): Promise<ImageResponseDto[]> {
    return this.imagesService.findMany(query);
  }

  @Get('/:id')
  @ApiOkResponse({ type: ImageResponseDto })
  @ApiNotFoundResponse({ description: 'Image not found' })
  public async findOne(@Param('id') id: string): Promise<ImageResponseDto> {
    return this.imagesService.findOne(id);
  }
}
