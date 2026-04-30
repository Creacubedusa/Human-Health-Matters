import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientRegisterDto } from './dto/patient-register.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { AuthService } from './auth.service';
import {
  EmailLoginDto,
  OtpDto,
  PhoneLoginDto,
  ResendOtpDto,
  ResetConfirmDto,
  ResetRequestDto,
} from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('patients/register')
  async registerPatient(@Body() body: PatientRegisterDto) {
    return this.auth.registerPatient(body);
  }

  @Post('doctors/register')
  async registerDoctor(@Body() body: DoctorRegisterDto) {
    return this.auth.registerDoctor(body);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: OtpDto) {
    return this.auth.verifyOtp(body.code);
  }

  @Post('otp/resend')
  async resendOtp(@Body() body: ResendOtpDto) {
    return this.auth.resendOtp(body.email);
  }

  @Post('login/email')
  async loginEmail(@Body() body: EmailLoginDto) {
    return this.auth.loginWithEmail(body.email, body.password);
  }

  @Post('login/phone')
  async loginPhone(@Body() body: PhoneLoginDto) {
    return this.auth.loginWithPhone(
      body.phone,
      body.phoneCountryCode,
      body.password,
    );
  }

  @Post('password/reset/request')
  async requestReset(@Body() body: ResetRequestDto) {
    return this.auth.sendResetCode(body.identifier);
  }

  @Post('password/reset/verify')
  async verifyReset(@Body() body: OtpDto) {
    return this.auth.verifyResetOtp(body.code);
  }

  @Post('password/reset/confirm')
  async confirmReset(@Body() body: ResetConfirmDto) {
    return this.auth.resetPassword(body.newPassword, body.code);
  }
}
