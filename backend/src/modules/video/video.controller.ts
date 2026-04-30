import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { VideoService } from './video.service';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import type { JwtPayload } from '../../common/auth/auth.types';

@ApiTags('video')
@ApiBearerAuth()
@Controller('video')
export class VideoController {
  constructor(private readonly video: VideoService) {}

  @Post('appointments/:id/join')
  @UseGuards(JwtAuthGuard)
  async join(@Req() req: Request & { user?: JwtPayload }, @Param('id') id: string) {
    const userId = req.user?.sub;
    const role = req.user?.role as Role | undefined;
    if (!userId || !role) throw new Error('missing_user');

    return await this.video.joinAppointmentVideo({
      appointmentId: id,
      userId,
      role,
    });
  }
}
