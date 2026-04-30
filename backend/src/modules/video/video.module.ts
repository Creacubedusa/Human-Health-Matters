import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DailyClient } from './daily/daily.client';
import { DailyWebhookController } from './webhooks/daily-webhook.controller';

@Module({
  imports: [PrismaModule],
  controllers: [VideoController, DailyWebhookController],
  providers: [VideoService, DailyClient],
  exports: [VideoService],
})
export class VideoModule {}
