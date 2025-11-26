import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { UploadFileResponseDto } from './responses';
import { FileUploadMapper } from './file-upload.mapper';

@Injectable()
export class FileUploadService {
  public constructor(private readonly s3Service: S3Service) {}

  public async uploadImageFile(file: Express.Multer.File): Promise<UploadFileResponseDto> {
    const { buffer, mimetype } = file;

    const result = await this.s3Service.uploadObject({
      fileBuffer: buffer,
      contentType: mimetype,
      keyPrefix: 'images',
    });

    return FileUploadMapper.toResponseDto(result);
  }
}
