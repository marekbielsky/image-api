import { ApiProperty } from '@nestjs/swagger';

export interface HealthResponseProps {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Overall health status of the app' })
  public readonly status!: string;

  @ApiProperty({
    example: '2025-11-26T04:50:00.000Z',
    description: 'Current server timestamp (ISO 8601)',
  })
  public readonly timestamp!: string;

  @ApiProperty({
    example: 'image-api',
    description: 'Application name or identifier',
  })
  public readonly service!: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Application version',
  })
  public readonly version!: string;

  public constructor(props: HealthResponseProps) {
    Object.assign(this, props);
  }
}
