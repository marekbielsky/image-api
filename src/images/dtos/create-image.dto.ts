import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ example: 'Sunset over the mountains' })
  public readonly title: string;

  @ApiProperty({ example: 1920 })
  public readonly width: number;

  @ApiProperty({ example: 1080 })
  public readonly height: number;

  public constructor(title: string, width: number, height: number) {
    this.title = title;
    this.width = width;
    this.height = height;
  }
}
