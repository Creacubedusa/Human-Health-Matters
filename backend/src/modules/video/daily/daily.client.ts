import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

type DailyRoom = {
  name: string;
  url: string;
};

@Injectable()
export class DailyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = (
      this.config.get<string>('DAILY_API_URL') ?? 'https://api.daily.co/v1'
    ).replace(/\/+$/, '');
    this.apiKey = this.config.get<string>('DAILY_API_KEY') ?? '';
  }

  async createRoom(args: {
    name: string;
    privacy?: 'private' | 'public';
    properties?: Record<string, unknown>;
  }): Promise<DailyRoom> {
    const json = await this.request('/rooms', {
      method: 'POST',
      body: {
        name: args.name,
        privacy: args.privacy ?? 'private',
        properties: args.properties ?? {},
      },
    });

    const res = z.object({ name: z.string(), url: z.string() }).parse(json);
    return { name: res.name, url: res.url };
  }

  async getRoom(name: string): Promise<DailyRoom | null> {
    const json = await this.request(
      `/rooms/${encodeURIComponent(name)}`,
      { method: 'GET' },
      { allow404: true },
    );
    if (!json) return null;
    const res = z.object({ name: z.string(), url: z.string() }).parse(json);
    return { name: res.name, url: res.url };
  }

  async createMeetingToken(args: {
    roomName: string;
    exp: number;
    userId: string;
    userName: string;
    isOwner: boolean;
  }): Promise<{ token: string }> {
    const json = await this.request('/meeting-tokens', {
      method: 'POST',
      body: {
        properties: {
          room_name: args.roomName,
          exp: args.exp,
          user_id: args.userId,
          user_name: args.userName,
          is_owner: args.isOwner,
          eject_at_token_exp: true,
        },
      },
    });

    const res = z.object({ token: z.string() }).parse(json);
    return { token: res.token };
  }

  private async request(
    path: string,
    init: { method: string; body?: unknown },
    opts?: { allow404?: boolean },
  ): Promise<unknown> {
    if (!this.apiKey)
      throw new InternalServerErrorException('daily_api_key_missing');

    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method: init.method,
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    if (opts?.allow404 && res.status === 404) return null;

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new InternalServerErrorException({
        code: 'daily_api_error',
        status: res.status,
        body: text,
      });
    }

    return (await res.json()) as unknown;
  }
}
