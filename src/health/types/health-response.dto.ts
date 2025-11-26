import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Overall health status of the app' })
  public status: string;

  @ApiProperty({
    example: '2025-11-26T04:50:00.000Z',
    description: 'Current server timestamp (ISO 8601)',
  })
  public timestamp: string;

  @ApiProperty({
    example: 'image-api',
    description: 'Application name or identifier',
  })
  public service: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Application version',
  })
  public version: string;

  public constructor(status: string, timestamp: string, service: string, version: string) {
    this.status = status;
    this.timestamp = timestamp;
    this.service = service;
    this.version = version;
  }
}
