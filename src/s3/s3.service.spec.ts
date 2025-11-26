import { S3Client } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { S3UploadOptions, S3UploadResult } from '@app/s3/types';

import { S3Service } from './s3.service';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockImplementation(() => ({})),
    })),
    HeadBucketCommand: jest.fn().mockImplementation((args) => ({ args })),
    PutObjectCommand: jest.fn().mockImplementation((args) => ({ args })),
  };
});

jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');

  return {
    ...actualCrypto,
    randomUUID: jest.fn().mockReturnValue('test-uuid'),
  };
});

describe('S3Service', () => {
  const ORIGINAL_ENV = process.env;

  const s3ClientMock = { send: jest.fn() };
  let s3Service: S3Service;

  beforeEach(async () => {
    process.env = {
      ...ORIGINAL_ENV,
      AWS_REGION: 'eu-north-1',
      AWS_ACCESS_KEY_ID: 'test-access-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret-key',
      AWS_S3_BUCKET: 'test-bucket',
      AWS_ENDPOINT: 'http://localhost:4566',
      AWS_FORCE_PATH_STYLE: 'true',
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [S3Service, { provide: S3Client, useValue: s3ClientMock }],
    })
      .overrideProvider(S3Client)
      .useValue(s3ClientMock)
      .compile();

    s3Service = moduleRef.get<S3Service>(S3Service);

    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('checkConnection', () => {
    it('should return ok when HeadBucket succeeds', async () => {
      s3ClientMock.send.mockResolvedValueOnce(undefined);

      const result = await s3Service.checkConnection();

      expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: 'ok',
        bucket: 'test-bucket',
      });
    });

    it('should throw InternalServerErrorException when HeadBucket fails', async () => {
      s3ClientMock.send.mockRejectedValueOnce(new Error('boom'));

      await expect(s3Service.checkConnection()).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('uploadObject', () => {
    it('should upload object and return S3UploadResult', async () => {
      s3ClientMock.send.mockResolvedValueOnce(undefined);

      const options: S3UploadOptions = {
        fileBuffer: Buffer.from('test-data'),
        contentType: 'image/png',
        keyPrefix: 'images',
      };

      const result: S3UploadResult = await s3Service.uploadObject(options);

      expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        key: 'images/test-uuid',
        url: 'https://test-bucket.s3.eu-north-1.amazonaws.com/images/test-uuid',
        bucket: 'test-bucket',
      });
    });

    it('should use default keyPrefix when not provided', async () => {
      s3ClientMock.send.mockResolvedValueOnce(undefined);

      const options: S3UploadOptions = {
        fileBuffer: Buffer.from('test-data'),
        contentType: 'image/png',
      };

      const result = await s3Service.uploadObject(options);

      expect(result.key).toBe('uploads/test-uuid');
    });

    it('should throw InternalServerErrorException when upload fails', async () => {
      s3ClientMock.send.mockRejectedValueOnce(new Error('upload failed'));

      const options: S3UploadOptions = {
        fileBuffer: Buffer.from('test-data'),
        contentType: 'image/png',
        keyPrefix: 'images',
      };

      await expect(s3Service.uploadObject(options)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
