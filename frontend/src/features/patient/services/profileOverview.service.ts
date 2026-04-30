<<<<<<< HEAD:src/features/patient/services/profileOverview.service.ts
import type { PatientProfileOverview } from '../types/profileOverview.types';

const PROFILE_AVATAR_URI = 'https://www.figma.com/api/mcp/asset/358adde8-f227-41f9-bef3-5355c4d8580d';

export async function fetchPatientProfileOverview(): Promise<PatientProfileOverview> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    isProfileComplete: false,
    avatarUri: PROFILE_AVATAR_URI,
    name: 'Angela Dairo',
    gender: 'Female',
    dateOfBirth: '',
    height: '170 cm',
    weight: '65 kg',
    age: '22 years',
    phone: '+9327821093124',
    email: 'Dairo@gmail.com',
    address: '123 King Abdulaziz Road',
    nationality: 'Saudi',
=======
import type { PatientProfileOverview, ProfileOverviewForm } from '../types/profileOverview.types';
import { http } from '@shared/api/http';
import { z } from 'zod';

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
    avatarUri: overview?.avatarUri ?? (typeof profileObj.avatarUri === 'string' ? profileObj.avatarUri : PROFILE_AVATAR_URI),
    name,
    gender: overview?.gender ?? gender,
    height,
    weight,
    age: overview?.age ?? '--',
    phone,
    email,
    address: overview?.address ?? address,
    nationality: overview?.nationality ?? nationality,
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/services/profileOverview.service.ts
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
<<<<<<< HEAD:src/features/patient/services/profileOverview.service.ts
        summary: 'Respiratory symptoms and chronic care notes',
        details: ['Difficulty breathing assessment', 'No prior surgery reported', 'Family history reviewed'],
      },
      {
        id: 'medication',
        title: 'Medication',
        summary: 'Current medications and usage notes',
        details: ['Amlodipine 10mg once daily', 'Prednisolone 20mg once daily for 3-5 days'],
=======
        summary: 'Patient profile data',
        details: [],
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/services/profileOverview.service.ts
      },
      {
        id: 'appointment',
        title: 'Appointment',
        summary: 'Recent and upcoming consultation activity',
<<<<<<< HEAD:src/features/patient/services/profileOverview.service.ts
        details: ['Video consultation with Doctor Paul Grant', 'Follow-up recommended in 5-7 days'],
      },
      {
        id: 'order',
        title: 'Order',
        summary: 'Clinical orders from consultation',
        details: ['Chest X-Ray ordered', 'Complete Blood Count ordered'],
      },
      {
        id: 'tests',
        title: 'Tests',
        summary: 'Recommended and completed tests',
        details: ['Chest X-Ray (PA & Lateral)', 'Complete Blood Count', 'Spirometry for further evaluation'],
      },
      {
        id: 'prescription',
        title: 'Prescription',
        summary: 'Prescription records and instructions',
        details: ['Albuterol inhaler as needed', 'Fluticasone 110 mcg twice daily for 2 weeks'],
=======
        details: [],
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/services/profileOverview.service.ts
      },
      {
        id: 'medical-docs',
        title: 'Medical reports and docs',
        summary: 'Uploaded and generated medical documents',
<<<<<<< HEAD:src/features/patient/services/profileOverview.service.ts
        details: ['Consultation summary', 'Prescription document', 'Care plan report'],
      },
    ],
    notificationEnabled: true,
    selectedLanguage: 'en',
  };
}
=======
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
>>>>>>> 290025c34b3930e6341a697d4a0c37e6f2562012:frontend/src/features/patient/services/profileOverview.service.ts
