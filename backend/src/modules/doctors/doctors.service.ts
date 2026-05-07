import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { DoctorFilterTab, DoctorRecommendation } from './types';
import {
  doctorHasAvailability,
  parseDoctorAvailabilitySettings,
  type DoctorAvailabilitySettings,
} from './schedule';

function formatAvailabilityRange(settings: DoctorAvailabilitySettings | null) {
  if (!doctorHasAvailability(settings)) return 'Availability not set';

  const populatedDays = settings.days.filter((day) => day.slots.length > 0);
  if (populatedDays.length === 0) return 'Availability not set';

  const firstSlot = populatedDays[0].slots[0];
  const lastSlot = populatedDays[0].slots[populatedDays[0].slots.length - 1];
  const toLabel = (value: string) => {
    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return minute === 0 ? `${hour12} ${period}` : `${hour12}:${minuteText} ${period}`;
  };

  return `${toLabel(firstSlot.startTime)} - ${toLabel(lastSlot.endTime)}`;
}

function isAvailableNow(settings: DoctorAvailabilitySettings | null) {
  if (!doctorHasAvailability(settings)) return false;

  const now = new Date();
  const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const day = settings.days.find((item) => item.key === weekdayKeys[now.getDay()]);
  if (!day) return false;

  const minutes = now.getHours() * 60 + now.getMinutes();
  return day.slots.some((slot) => {
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return minutes >= start && minutes < end;
  });
}

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
      const availabilitySettings = parseDoctorAvailabilitySettings(
        d.doctorProfile?.availabilitySettings,
      );
      const hasAvailability = doctorHasAvailability(availabilitySettings);

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
        isAvailableNow: isAvailableNow(availabilitySettings),
        patientsLabel: '100+',
        experienceLabel: '10 yr',
        about: d.doctorProfile?.bio ?? '',
        availabilityRange: formatAvailabilityRange(availabilitySettings),
        hasAvailability,
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
