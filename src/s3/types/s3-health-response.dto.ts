import { ApiProperty } from '@nestjs/swagger';

export class S3HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  public status: string;

  @ApiProperty({ example: 'image-api-marekbielski-eu' })
  public bucket: string;

  public constructor(status: string, bucket: string) {
    this.status = status;
    this.bucket = bucket;
  }
}
