import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorProfileDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUri?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalCertificate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  boardCertificate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deaRegistration?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  malpracticeInsurance?: string | null;
}
