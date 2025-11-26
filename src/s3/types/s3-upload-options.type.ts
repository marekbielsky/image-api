export interface S3UploadOptions {
  fileBuffer: Buffer;
  contentType: string;
  keyPrefix?: string;
}
