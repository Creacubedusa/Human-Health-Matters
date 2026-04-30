import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
