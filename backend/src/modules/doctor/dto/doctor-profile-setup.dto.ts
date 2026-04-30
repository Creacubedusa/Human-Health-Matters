import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class DoctorProfileSetupDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialties!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUri?: string;
}

