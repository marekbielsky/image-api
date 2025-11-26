import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Image } from '@prisma/client';

export interface CreateImageEntityProps {
  title: string;
  url: string;
  width: number;
  height: number;
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

  public async findAll(): Promise<Image[]> {
    return this.prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
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
