import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';

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

  public async checkConnection(): Promise<{ ok: boolean; bucket: string }> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return { ok: true, bucket: this.bucket };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to access S3 bucket "${this.bucket}": ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Failed to access S3 bucket "${this.bucket}" (non-Error thrown): ${JSON.stringify(
            error,
          )}`,
        );
      }

      throw new InternalServerErrorException(
        'Cannot access S3 bucket. Check AWS credentials, region, and bucket name.',
      );
    }
  }
}
