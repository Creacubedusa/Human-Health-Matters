import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ComputeTriageDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  userMessages!: string[];

  @ApiProperty()
  @IsString()
  sessionId!: string;
}
