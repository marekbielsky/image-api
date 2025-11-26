import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';

import { PrismaService } from '@app/prisma/prisma.service';

import { CreateImageEntityProps, FindImagesParams } from './types/images.repository.types';

@Injectable()
export class ImagesRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(data: CreateImageEntityProps): Promise<Image> {
    return this.prisma.image.create({ data });
  }

  public async findMany(params: FindImagesParams): Promise<Image[]> {
    const { title, page, limit } = params;

    return this.prisma.image.findMany({
      where: title
        ? {
            title: {
              contains: title,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  public async findById(id: string): Promise<Image | null> {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }
}
