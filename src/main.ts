import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const v1Config = new DocumentBuilder().setTitle('Image API v1').setVersion('1.0').build();
  const v1Document = SwaggerModule.createDocument(app, v1Config);

  SwaggerModule.setup('api/v1/docs', app, v1Document);

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });

  app.use(helmet());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
