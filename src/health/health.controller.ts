import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './responses';

@ApiTags('/health')
@Controller('/health')
export class HealthController {
  @Get('/')
  @ApiOkResponse({ type: HealthResponseDto })
  public health(): HealthResponseDto {
    return new HealthResponseDto({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'image-api',
      version: process.env.npm_package_version ?? 'unknown',
    });
  }
}
