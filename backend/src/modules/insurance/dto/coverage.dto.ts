import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsObject, IsString } from 'class-validator';

export class CoverageVerificationRequestDto {
  @ApiProperty({ enum: ['insurance', 'donor'] })
  @IsIn(['insurance', 'donor'])
  path!: 'insurance' | 'donor';

  @ApiProperty()
  @IsObject()
  insuredForm!: Record<string, unknown>;

  @ApiProperty()
  @IsObject()
  noInsuranceForm!: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  scenarioId!: string;
}
