import { ApiProperty } from '@nestjs/swagger';

export interface S3HealthResponseProps {
  status: string;
  bucket: string;
}

export class S3HealthResponseDto implements S3HealthResponseProps {
  @ApiProperty({ example: 'ok' })
  public readonly status!: string;

  @ApiProperty({ example: 'image-api-marekbielski-eu' })
  public readonly bucket!: string;

  public constructor(props: S3HealthResponseProps) {
    Object.assign(this, props);
  }
}
