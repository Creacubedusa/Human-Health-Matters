import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LabOrdersController } from './lab-orders.controller';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [LabOrdersController],
})
export class LabOrdersModule {}
