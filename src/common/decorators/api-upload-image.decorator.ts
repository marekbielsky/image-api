import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';

import { ApiImageFile } from '..';

export const ApiUploadImage = <TModel extends Type<unknown>>(model: TModel) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiImageFile('file'),
    ApiBody({
      description: 'Upload and resize an image',
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
          title: { type: 'string' },
          width: { type: 'integer', format: 'int32' },
          height: { type: 'integer', format: 'int32' },
        },
        required: ['file', 'title', 'width', 'height'],
      },
    }),
    ApiCreatedResponse({ type: model }),
  );
