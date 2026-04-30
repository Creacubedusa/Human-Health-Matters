import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { PatientsModule } from './modules/patients/patients.module';
import { TriageModule } from './modules/triage/triage.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/auth/roles.guard';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { VideoModule } from './modules/video/video.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MailerModule,
    AuthModule,
    InsuranceModule,
    PatientsModule,
    TriageModule,
    AppointmentsModule,
    DoctorModule,
    DoctorsModule,
    NotificationsModule,
    VideoModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
