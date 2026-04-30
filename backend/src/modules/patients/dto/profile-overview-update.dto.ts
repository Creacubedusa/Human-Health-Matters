import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfileOverviewUpdateDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  gender!: string;

  @ApiProperty()
  @IsString()
  height!: string;

  @ApiProperty()
  @IsString()
  weight!: string;

  @ApiProperty()
  @IsString()
  age!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsString()
  nationality!: string;

  @ApiProperty()
  @IsString()
  selectedLanguage!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUri?: string;
}

