import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { S3HealthResponseDto } from './responses';
import { S3Service } from './s3.service';

@ApiTags('/s3')
@Controller('/s3')
export class S3Controller {
  public constructor(private readonly s3Service: S3Service) {}

  @Get('/health')
  @ApiOkResponse({ type: S3HealthResponseDto })
  public async health(): Promise<S3HealthResponseDto> {
    const result = await this.s3Service.checkConnection();

    return new S3HealthResponseDto({ status: 'ok', bucket: result.bucket });
  }
}
