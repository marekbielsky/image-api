import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    example: 'images/3b7f3c01-0c6c-4cdb-9a96-123456789abc',
    description: 'Key of the stored object in S3',
  })
  public readonly key: string;

  @ApiProperty({
    example:
      'https://image-api-marekbielski-eu.s3.eu-north-1.amazonaws.com/images/3b7f3c01-0c6c-4cdb-9a96-123456789abc',
    description: 'Public URL of the uploaded file',
  })
  public readonly url: string;

  @ApiProperty({
    example: 'image-api-marekbielski-eu',
    description: 'Name of the S3 bucket',
  })
  public readonly bucket: string;

  public constructor(key: string, url: string, bucket: string) {
    this.key = key;
    this.url = url;
    this.bucket = bucket;
  }
}
