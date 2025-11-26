import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './types';

@ApiTags('/health')
@Controller('/health')
export class HealthController {
  @Get('/')
  @ApiOkResponse({ type: HealthResponseDto })
  public health(): HealthResponseDto {
    const status = 'ok';
    const timestamp = new Date().toISOString();
    const service = 'image-api';
    const version = process.env.npm_package_version ?? 'unknown';

    return new HealthResponseDto(status, timestamp, service, version);
  }
}
