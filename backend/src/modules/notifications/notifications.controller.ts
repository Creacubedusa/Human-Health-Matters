import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  async markRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) throw new Error('missing_user');

    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification || notification.userId !== userId) return { ok: true };

    await this.prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });

    return { ok: true };
  }

  constructor(private readonly prisma: PrismaService) {}
}
