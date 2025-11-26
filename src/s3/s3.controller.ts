import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { S3HealthResponseDto } from './types';

@ApiTags('/s3')
@Controller('/s3')
export class S3Controller {
  public constructor(private readonly s3Service: S3Service) {}

  @Get('/health')
  @ApiOkResponse({ type: S3HealthResponseDto })
  public async health(): Promise<S3HealthResponseDto> {
    const result = await this.s3Service.checkConnection();

    return new S3HealthResponseDto('ok', result.bucket);
  }
}
