import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { UploadFileResponseDto } from './responses';

@ApiTags('/files')
@Controller('/files')
export class FileUploadController {
  public constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: UploadFileResponseDto })
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.fileUploadService.uploadImageFile(file);
  }
}
