import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { DoctorsService } from './doctors.service';
import type { DoctorFilterTab } from './types';
import { PrismaService } from '../../prisma/prisma.service';
import { buildScheduleForMonth } from './schedule';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctors: DoctorsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Query('filter') filter?: DoctorFilterTab) {
    return this.doctors.listDoctors(filter ?? 'aiRecommended');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: string) {
    const d = await this.doctors.getDoctor(id);
    if (!d) return null;
    const doctorProfile = d.doctorProfile as unknown as {
      specialties?: string[];
      bio?: string | null;
      avatarUri?: string | null;
    } | null;
    return {
      id: d.id,
      name: `Dr. ${[d.firstName, d.lastName].filter(Boolean).join(' ')}`.trim(),
      specialties: doctorProfile?.specialties ?? [],
      bio: doctorProfile?.bio ?? '',
      avatarUri: doctorProfile?.avatarUri ?? null,
    };
  }

  @Get(':id/reviews')
  @UseGuards(JwtAuthGuard)
  async reviews(@Param('id') id: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: id },
      include: {
        reviews: true,
        patient: { select: { firstName: true, lastName: true } },
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    return appointments.flatMap((a) =>
      a.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        patientName: [a.patient.firstName, a.patient.lastName]
          .filter(Boolean)
          .join(' '),
      })),
    );
  }

  @Get(':id/schedule')
  @UseGuards(JwtAuthGuard)
  schedule(
    @Query('year') yearText?: string,
    @Query('month') monthText?: string,
  ) {
    const now = new Date();
    const year = yearText ? Number(yearText) : now.getFullYear();
    const month = monthText ? Number(monthText) : now.getMonth() + 1;
    const monthIndex = Math.min(11, Math.max(0, month - 1));
    const safeYear = Number.isFinite(year) ? year : now.getFullYear();
    return buildScheduleForMonth(safeYear, monthIndex);
  }
}
