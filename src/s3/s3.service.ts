import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { S3HealthResponseDto } from 'src/s3/responses';
import { S3UploadOptions, S3UploadResult } from '@app/s3/types';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  public constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const endpoint = process.env.AWS_ENDPOINT;
    const forcePathStyle = process.env.AWS_FORCE_PATH_STYLE === 'true';

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Missing AWS S3 configuration. Check AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.',
      );
    }

    this.bucket = process.env.AWS_S3_BUCKET ?? '';

    if (!this.bucket) {
      throw new Error('Missing AWS_S3_BUCKET in environment.');
    }

    this.s3 = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  public async checkConnection(): Promise<S3HealthResponseDto> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));

      return new S3HealthResponseDto('ok', this.bucket);
    } catch (error) {
      this.handleError(
        error,
        'Failed to access S3 bucket',
        'Cannot access S3 bucket. Check AWS credentials, region, and bucket name.',
      );
    }
  }

  public async uploadObject(options: S3UploadOptions): Promise<S3UploadResult> {
    const { fileBuffer, contentType, keyPrefix = 'uploads' } = options;
    const key = `${keyPrefix}/${randomUUID()}`;

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

      return { key, url, bucket: this.bucket };
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
