import { HealthController } from './health.controller';
import { HealthResponseDto } from './responses';

describe('HealthController', () => {
  let healthController: HealthController;
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      npm_package_version: '1.2.3',
    };

    healthController = new HealthController();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should return ok health status with service name and version', () => {
    const result: HealthResponseDto = healthController.health();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('image-api');
    expect(result.version).toBe('1.2.3');

    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should fall back to "unknown" when version env is not set', () => {
    delete process.env.npm_package_version;
    const controllerWithoutVersion = new HealthController();

    const result = controllerWithoutVersion.health();

    expect(result.version).toBe('unknown');
  });
});
