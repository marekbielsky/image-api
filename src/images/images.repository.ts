import { Image } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';

export interface CreateImageEntityProps {
  title: string;
  url: string;
  width: number;
  height: number;
}

export interface FindImagesParams {
  title?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ImagesRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(data: CreateImageEntityProps): Promise<Image> {
    return this.prisma.image.create({
      data: {
        title: data.title,
        url: data.url,
        width: data.width,
        height: data.height,
      },
    });
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

  public async deleteById(id: string): Promise<void> {
    await this.prisma.image.delete({ where: { id } });
  }
}
