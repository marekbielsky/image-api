import { ApiProperty } from '@nestjs/swagger';

export interface ImageResponseProps {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ImageResponseDto implements ImageResponseProps {
  @ApiProperty({ example: 'cltxyz123abc' })
  public readonly id!: string;

  @ApiProperty({ example: 'Sunset over the mountains' })
  public readonly title!: string;

  @ApiProperty({
    example: 'https://image-api-marekbielski-eu.s3.eu-north-1.amazonaws.com/images/123.jpg',
  })
  public readonly url!: string;

  @ApiProperty({ example: 1920 })
  public readonly width!: number;

  @ApiProperty({ example: 1080 })
  public readonly height!: number;

  @ApiProperty({ example: '2025-11-26T04:50:00.000Z' })
  public readonly createdAt!: Date;

  @ApiProperty({ example: '2025-11-26T04:51:00.000Z' })
  public readonly updatedAt!: Date;

  public constructor(props: ImageResponseProps) {
    Object.assign(this, props);
  }
}
