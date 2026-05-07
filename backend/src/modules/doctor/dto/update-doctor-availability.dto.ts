import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class UpdateDoctorAvailabilitySlotDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  startTime!: string;

  @ApiProperty()
  @IsString()
  endTime!: string;
}

class UpdateDoctorAvailabilityDayDto {
  @ApiProperty({ enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] })
  @IsIn(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])
  key!: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty({ type: [UpdateDoctorAvailabilitySlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDoctorAvailabilitySlotDto)
  slots!: UpdateDoctorAvailabilitySlotDto[];
}

class UpdateDoctorBookingLimitsDto {
  @ApiProperty()
  @IsBoolean()
  bufferEnabled!: boolean;

  @ApiProperty({ enum: [10, 15, 30, 45] })
  @IsIn([10, 15, 30, 45])
  bufferDurationMinutes!: 10 | 15 | 30 | 45;

  @ApiProperty()
  @IsBoolean()
  dailyLimitEnabled!: boolean;

  @ApiPropertyOptional()
  @IsString()
  dailyLimit!: string;
}

export class UpdateDoctorAvailabilityDto {
  @ApiProperty()
  @IsString()
  fromDate!: string;

  @ApiProperty()
  @IsString()
  toDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeZone?: string;

  @ApiProperty({ enum: [15, 30, 45, 60] })
  @IsIn([15, 30, 45, 60])
  appointmentDurationMinutes!: 15 | 30 | 45 | 60;

  @ApiProperty({ type: [UpdateDoctorAvailabilityDayDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDoctorAvailabilityDayDto)
  days!: UpdateDoctorAvailabilityDayDto[];

  @ApiProperty({ type: UpdateDoctorBookingLimitsDto })
  @ValidateNested()
  @Type(() => UpdateDoctorBookingLimitsDto)
  bookingLimits!: UpdateDoctorBookingLimitsDto;
}
