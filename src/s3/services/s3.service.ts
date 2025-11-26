import { HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { S3HealthResponseDto, S3UploadFileResponseDto } from '../responses';
import { S3UploadOptions } from '../types';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  public constructor(private readonly s3: S3Client) {
    this.bucket = process.env.AWS_S3_BUCKET ?? '';
    if (!this.bucket) throw new Error('Missing AWS_S3_BUCKET in environment.');
  }

  public async checkConnection(): Promise<S3HealthResponseDto> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));

      return new S3HealthResponseDto({
        status: 'ok',
        bucket: this.bucket,
      });
    } catch (error) {
      this.handleError(
        error,
        'Failed to access S3 bucket',
        'Cannot access S3 bucket. Check AWS credentials, region, and bucket name.',
      );
    }
  }

  public async uploadObject(options: S3UploadOptions): Promise<S3UploadFileResponseDto> {
    const { fileBuffer, contentType, keyPrefix } = options;
    const key = `${keyPrefix ?? 'uploads'}/${randomUUID()}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
        }),
      );

      const region = process.env.AWS_REGION;
      const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;

      return new S3UploadFileResponseDto({ key, url, bucket: this.bucket });
    } catch (error) {
      this.handleError(error, 'Failed to upload object to S3', 'Failed to upload file to S3.');
    }
  }

  private handleError(error: unknown, logMessage: string, clientMessage: string): never {
    if (error instanceof Error) {
      this.logger.error(`${logMessage} (bucket="${this.bucket}"): ${error.message}`, error.stack);
    } else {
      this.logger.error(
        `${logMessage} (bucket="${this.bucket}", non-Error): ${JSON.stringify(error)}`,
      );
    }

    throw new InternalServerErrorException(clientMessage);
  }
}
