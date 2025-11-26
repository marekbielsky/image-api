import { Test } from '@nestjs/testing';

import { S3HealthResponseDto, S3HealthResponseProps } from '../responses';
import { S3Service } from '../services/s3.service';

import { S3Controller } from './s3.controller';

describe('S3Controller', () => {
  let s3Controller: S3Controller;
  let s3Service: jest.Mocked<S3Service>;

  beforeEach(async () => {
    const s3ServiceMock: jest.Mocked<S3Service> = {
      checkConnection: jest.fn(),
    } as unknown as jest.Mocked<S3Service>;

    const moduleRef = await Test.createTestingModule({
      controllers: [S3Controller],
      providers: [
        {
          provide: S3Service,
          useValue: s3ServiceMock,
        },
      ],
    }).compile();

    s3Controller = moduleRef.get(S3Controller);
    s3Service = moduleRef.get(S3Service);
  });

  describe('health', () => {
    it('should call S3Service.checkConnection and return ok status with bucket', async () => {
      const serviceResult: S3HealthResponseProps = {
        status: 'ok',
        bucket: 'test-bucket',
      };

      s3Service.checkConnection.mockResolvedValue(new S3HealthResponseDto(serviceResult));

      const result = await s3Controller.health();

      expect(s3Service.checkConnection).toHaveBeenCalledTimes(1);
      expect(result).toEqual(new S3HealthResponseDto({ status: 'ok', bucket: 'test-bucket' }));
    });

    it('should propagate errors from S3Service', async () => {
      s3Service.checkConnection.mockRejectedValue(new Error('S3 unavailable'));

      await expect(s3Controller.health()).rejects.toThrow('S3 unavailable');
    });
  });
});
