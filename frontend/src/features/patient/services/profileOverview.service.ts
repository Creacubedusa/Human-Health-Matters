import { z } from 'zod';
import { http } from '@shared/api/http';
import type { PatientProfileOverview, ProfileOverviewForm } from '../types/profileOverview.types';

const PROFILE_AVATAR_URI = 'https://www.figma.com/api/mcp/asset/358adde8-f227-41f9-bef3-5355c4d8580d';

const ApiProfileResponseSchema = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    phoneCountryCode: z.string().nullable().optional(),
  }),
  profile: z.unknown().nullable(),
  onboardingCompletedAt: z.string().datetime().nullable().optional(),
});

export async function fetchPatientProfileOverview(): Promise<PatientProfileOverview> {
  const res = await http.get('/patients/profile');
  const api = ApiProfileResponseSchema.parse(res.data);

  const profileObj =
    api.profile && typeof api.profile === 'object' ? (api.profile as Record<string, unknown>) : {};

  const overview =
    profileObj.profileOverview && typeof profileObj.profileOverview === 'object'
      ? (profileObj.profileOverview as Partial<ProfileOverviewForm>)
      : null;

  const gender = typeof profileObj.gender === 'string' ? profileObj.gender : '';
  const nationality = typeof profileObj.nationality === 'string' ? profileObj.nationality : '';
  const address = typeof profileObj.address === 'string' ? profileObj.address : '';
  const dateOfBirth = typeof profileObj.dateOfBirth === 'string' ? profileObj.dateOfBirth : '';

  const weight =
    typeof profileObj.weight === 'number' && typeof profileObj.weightUnit === 'string'
      ? `${profileObj.weight} ${profileObj.weightUnit}`
      : overview?.weight ?? '--';

  const height =
    typeof profileObj.heightUnit === 'string'
      ? profileObj.heightUnit === 'cm' && typeof profileObj.heightCm === 'number'
        ? `${profileObj.heightCm} cm`
        : profileObj.heightUnit === 'ft_in' &&
            typeof profileObj.heightFeet === 'number' &&
            typeof profileObj.heightInches === 'number'
          ? `${profileObj.heightFeet} ft ${profileObj.heightInches} in`
          : overview?.height ?? '--'
      : overview?.height ?? '--';

  const name = overview?.name ?? `${api.user.firstName} ${api.user.lastName}`.trim();
  const email = overview?.email ?? api.user.email ?? '';
  const phone = overview?.phone ?? `${api.user.phoneCountryCode ?? ''}${api.user.phone ?? ''}`.trim();

  return {
    isProfileComplete: Boolean(api.onboardingCompletedAt),
    avatarUri:
      overview?.avatarUri ??
      (typeof profileObj.avatarUri === 'string' ? profileObj.avatarUri : PROFILE_AVATAR_URI),
    name,
    gender: overview?.gender ?? gender,
    dateOfBirth: overview?.dateOfBirth ?? dateOfBirth,
    height,
    weight,
    age: overview?.age ?? '--',
    phone,
    email,
    address: overview?.address ?? address,
    nationality: overview?.nationality ?? nationality,
    healthcareSupport: {
      applied: true,
      title: 'Healthcare Support applied',
      subtitle: 'View the impact of Donor Support',
      report: [
        'Donor support has been applied to eligible consultation costs.',
        'Your care access is currently supported by the HHM community health fund.',
      ],
    },
    medicalRecords: [
      {
        id: 'patient-history',
        title: 'Patient history',
        summary: 'Patient profile data',
        details: [],
      },
      {
        id: 'appointment',
        title: 'Appointment',
        summary: 'Recent and upcoming consultation activity',
        details: [],
      },
      {
        id: 'medical-docs',
        title: 'Medical reports and docs',
        summary: 'Uploaded and generated medical documents',
        details: [],
      },
      {
        id: 'medication',
        title: 'Medication',
        summary: 'Current medications and usage notes',
        details: [],
      },
      {
        id: 'order',
        title: 'Order',
        summary: 'Clinical orders from consultation',
        details: [],
      },
      {
        id: 'tests',
        title: 'Tests',
        summary: 'Recommended and completed tests',
        details: [],
      },
      {
        id: 'prescription',
        title: 'Prescription',
        summary: 'Prescription records and instructions',
        details: [],
      },
    ],
    notificationEnabled: true,
    selectedLanguage: overview?.selectedLanguage ?? 'en',
  };
}

export async function updatePatientProfileOverview(form: ProfileOverviewForm) {
  await http.patch('/patients/profile/overview', form);
}
