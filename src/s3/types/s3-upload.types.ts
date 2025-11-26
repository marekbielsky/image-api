export interface S3UploadOptions {
  fileBuffer: Buffer;
  contentType: string;
  keyPrefix?: string;
}

export interface S3UploadResult {
  key: string;
  url: string;
  bucket: string;
}
