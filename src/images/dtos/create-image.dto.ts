import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Max, Min } from 'class-validator';

import { AspectRatio } from '@app/common';

export interface CreateImageProps {
  title: string;
  width: number;
  height: number;
}

export class CreateImageDto implements CreateImageProps {
  @ApiProperty({ example: 'Sunset over the mountains' })
  @IsString()
  public readonly title!: string;

  @ApiProperty({ example: 1920 })
  @IsNumber()
  @IsPositive()
  @Min(50)
  @Max(5000)
  public readonly width!: number;

  @ApiProperty({ example: 1080 })
  @IsNumber()
  @IsPositive()
  @Min(50)
  @Max(5000)
  @AspectRatio<CreateImageDto>('width', {
    min: 0.25,
    max: 4,
    message: 'Unreasonable aspect ratio (too wide or too tall)',
  })
  public readonly height!: number;

  public constructor(props: CreateImageProps) {
    Object.assign(this, props);
  }
}
