import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ImageFileOptions {
  maxSizeBytes?: number;
  mimeTypes?: string[];
  required?: boolean;
}

const DEFAULT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const ImageFile = createParamDecorator(
  (options: ImageFileOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file: Express.Multer.File | undefined = request.file;

    const {
      maxSizeBytes = DEFAULT_IMAGE_MAX_SIZE,
      mimeTypes = DEFAULT_IMAGE_MIME_TYPES,
      required = true,
    } = options ?? {};

    if (!file) {
      if (required) {
        throw new BadRequestException('File is required.');
      }

      return undefined;
    }

    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `File is too large. Max allowed size is ${maxSizeBytes} bytes.`,
      );
    }

    if (!mimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${mimeTypes.join(', ')}`);
    }

    return file;
  },
);
