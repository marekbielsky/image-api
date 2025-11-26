import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiImageFile, ImageFile } from '@app/common';

import { CreateImageDto, GetImagesQueryDto } from './dtos';
import { ImagesService } from './images.service';
import { ImageResponseDto } from './responses';

@ApiTags('/images')
@Controller('/images')
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImageFile('file')
  @ApiBody({
    description: 'Upload and resize an image',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        width: { type: 'integer', format: 'int32' },
        height: { type: 'integer', format: 'int32' },
      },
      required: ['file', 'title', 'width', 'height'],
    },
  })
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
