import { Injectable } from '@nestjs/common';
import { UploadFileResponseDto } from './responses';
import { FileUploadMapper } from './file-upload.mapper';
import { S3Service } from '@app/s3/s3.service';
import { S3UploadOptions, S3UploadResult } from '@app/s3/types';

@Injectable()
export class FileUploadService {
  public constructor(private readonly s3Service: S3Service) {}

  public async uploadImageFromBuffer(options: S3UploadOptions): Promise<UploadFileResponseDto> {
    const s3Options: S3UploadOptions = {
      fileBuffer: options.fileBuffer,
      contentType: options.contentType,
      keyPrefix: options.keyPrefix ?? 'uploads',
    };

    const result: S3UploadResult = await this.s3Service.uploadObject(s3Options);
    return FileUploadMapper.toResponseDto(result);
  }
}
