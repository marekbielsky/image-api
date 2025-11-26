import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ example: 'Sunset over the mountains' })
  @IsString()
  public readonly title: string;

  @ApiProperty({ example: 1920 })
  @IsNumber()
  public readonly width: number;

  @ApiProperty({ example: 1080 })
  @IsNumber()
  public readonly height: number;

  public constructor(title: string, width: number, height: number) {
    this.title = title;
    this.width = width;
    this.height = height;
  }
}
