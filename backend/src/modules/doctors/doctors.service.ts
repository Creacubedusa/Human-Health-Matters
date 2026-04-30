import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { DoctorFilterTab, DoctorRecommendation } from './types';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async listDoctors(filter: DoctorFilterTab): Promise<DoctorRecommendation[]> {
    const doctors = await this.prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: {
        doctorProfile: true,
        appointmentsAsDoctor: {
          include: { reviews: true },
        },
      },
      take: 50,
    });

    const mapped = doctors.map<DoctorRecommendation>((d) => {
      const reviews = d.appointmentsAsDoctor.flatMap((a) => a.reviews);
      const rating =
        reviews.length === 0
          ? 0
          : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      const specialty = d.doctorProfile?.specialties?.[0] ?? '';

      return {
        id: d.id,
        name: `Dr. ${[d.firstName, d.lastName].filter(Boolean).join(' ')}`.trim(),
        specialty,
        avatarUri:
          d.doctorProfile?.avatarUri ?? 'https://i.pravatar.cc/160?img=12',
        matchScore: 90,
        rating: Number(rating.toFixed(1)),
        reviewCount: reviews.length,
        donorFunded: true,
        aiReason: 'Recommended based on your triage and availability',
        isAvailableNow: true,
        patientsLabel: '100+',
        experienceLabel: '10 yr',
        about: d.doctorProfile?.bio ?? '',
        availabilityRange: '9 AM - 5 PM',
      };
    });

    if (filter === 'topRated')
      return mapped.sort((a, b) => b.rating - a.rating);
    if (filter === 'availableNow')
      return mapped.sort(
        (a, b) => Number(b.isAvailableNow) - Number(a.isAvailableNow),
      );
    return mapped.sort((a, b) => b.matchScore - a.matchScore);
  }

  async getDoctor(id: string) {
    return this.prisma.user.findFirst({
      where: { id, role: 'DOCTOR' },
      include: { doctorProfile: true },
    });
  }
}
