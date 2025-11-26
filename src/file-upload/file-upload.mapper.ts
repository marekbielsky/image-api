import { UploadFileResponseDto } from './responses';
import { S3UploadResult } from '@app/s3/types';

export class FileUploadMapper {
  public static toResponseDto(result: S3UploadResult): UploadFileResponseDto {
    return new UploadFileResponseDto({
      key: result.key,
      url: result.url,
      bucket: result.bucket,
    });
  }
}
