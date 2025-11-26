import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { ImageResponseDto } from './responses';
import { CreateImageDto } from './dtos';

@ApiTags('/images')
@Controller('/images')
export class ImagesController {
  public constructor(private readonly imagesService: ImagesService) {}

  @Post('/')
  @ApiCreatedResponse({ type: ImageResponseDto })
  public async create(@Body() body: CreateImageDto): Promise<ImageResponseDto> {
    return this.imagesService.create(body);
  }

  @Get('/')
  @ApiOkResponse({ type: ImageResponseDto, isArray: true })
  public async findAll(): Promise<ImageResponseDto[]> {
    return this.imagesService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({ type: ImageResponseDto })
  @ApiNotFoundResponse({ description: 'Image not found' })
  public async findOne(@Param('id') id: string): Promise<ImageResponseDto> {
    return this.imagesService.findOne(id);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Image successfully deleted' })
  public async remove(@Param('id') id: string): Promise<void> {
    return this.imagesService.remove(id);
  }
}
