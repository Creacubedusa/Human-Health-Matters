import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { z } from 'zod';

const SignRequestSchema = z.object({
  folder: z.string().min(1).optional(),
  publicId: z.string().min(1).optional(),
});

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads/cloudinary')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @Post('signature')
  @UseGuards(JwtAuthGuard)
  async signature(@Req() req: any, @Body() body: unknown) {
    void req;
    const input = SignRequestSchema.parse(body ?? {});

    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME') ?? '';
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY') ?? '';
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET') ?? '';
    const defaultFolder = this.config.get<string>('CLOUDINARY_UPLOAD_FOLDER') ?? 'hhm';
    if (!cloudName || !apiKey || !apiSecret) throw new Error('cloudinary_not_configured');

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = input.folder ?? defaultFolder;
    const publicId = input.publicId ?? undefined;

    const params: Record<string, string> = {
      folder,
      timestamp: String(timestamp),
    };
    if (publicId) params.public_id = publicId;

    const toSign = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    const signature = createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex');

    return {
      cloudName,
      apiKey,
      timestamp,
      folder,
      publicId,
      signature,
    };
  }
}

