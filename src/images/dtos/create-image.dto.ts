import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ example: 'Sunset over the mountains' })
  public readonly title: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL (will come from S3 in the future).',
  })
  public readonly url: string;

  @ApiProperty({ example: 1920 })
  public readonly width: number;

  @ApiProperty({ example: 1080 })
  public readonly height: number;

  public constructor(title: string, url: string, width: number, height: number) {
    this.title = title;
    this.url = url;
    this.width = width;
    this.height = height;
  }
}
