import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ProfileSetupDto {
  @ApiProperty()
  @IsObject()
  payload!: Record<string, unknown>;
}
