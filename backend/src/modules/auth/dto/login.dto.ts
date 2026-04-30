import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class PhoneLoginDto {
  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: '+234' })
  @IsString()
  phoneCountryCode!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class OtpDto {
  @ApiProperty()
  @IsString()
  code!: string;
}

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

export class ResetRequestDto {
  @ApiProperty()
  @IsString()
  identifier!: string;
}

export class ResetConfirmDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @ApiProperty()
  @IsString()
  code!: string;
}
