import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUsers(
    userIds: string[],
    input: {
      type: NotificationType;
      title: string;
      message: string;
      data?: Prisma.InputJsonValue;
    },
  ) {
    const ids = Array.from(new Set(userIds)).filter(Boolean);
    if (ids.length === 0) return;

    await this.prisma.notification.createMany({
      data: ids.map((userId) => ({
        userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data ?? undefined,
      })),
    });
  }
}
