import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CarePlansController } from './care-plans.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CarePlansController],
})
export class CarePlansModule {}
