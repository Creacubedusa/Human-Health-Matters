import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createHmac, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { VideoService } from '../video.service';
import type { Request } from 'express';
import { z } from 'zod';

@ApiTags('webhooks')
@Controller('webhooks/daily')
export class DailyWebhookController {
  constructor(
    private readonly config: ConfigService,
    private readonly video: VideoService,
  ) {}

  @Post()
  async handle(
    @Req() req: Request & { rawBody?: Buffer; body: unknown },
    @Headers('x-webhook-signature') signature?: string,
    @Headers('x-webhook-timestamp') timestamp?: string,
  ) {
    const isVerificationPing = z
      .object({ test: z.string() })
      .safeParse(req.body).success;
    if (isVerificationPing) return { ok: true };

    const hmacSecret = this.config.get<string>('DAILY_WEBHOOK_HMAC') ?? '';
    if (!hmacSecret)
      throw new BadRequestException('daily_webhook_hmac_missing');
    if (!signature) throw new BadRequestException('missing_signature');
    if (!timestamp) throw new BadRequestException('missing_timestamp');

    const rawBody = req.rawBody;
    if (!rawBody) throw new BadRequestException('missing_raw_body');

    const key = Buffer.from(hmacSecret, 'base64');
    const computedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
    const computed = createHmac('sha256', key)
      .update(computedPayload)
      .digest('base64');

    const a = Buffer.from(computed);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !timingSafeEqual(a, b))
      throw new BadRequestException('invalid_signature');

    const event = z
      .object({
        type: z.string().optional(),
        payload: z
          .object({
            room: z.string().optional(),
            room_name: z.string().optional(),
          })
          .optional(),
      })
      .passthrough()
      .parse(req.body);

    const eventType = event.type ?? '';
    const roomName = event.payload?.room ?? event.payload?.room_name ?? '';
    if (!roomName) return { ok: true };

    if (eventType === 'meeting.started' || eventType === 'call.started')
      await this.video.markActiveByRoomName(roomName);
    if (eventType === 'meeting.ended' || eventType === 'call.ended')
      await this.video.markEndedByRoomName(roomName);

    return { ok: true };
  }
}
